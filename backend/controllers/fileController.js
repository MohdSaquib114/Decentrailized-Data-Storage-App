const { uploadToIPFS, downloadFromIPFS } = require("../utils/pinata");
const {
  storeFileOnChain,
  grantFileAccess,
  revokeFileAccess,
  fetchUserFiles,
  fetchCIDFromChain,
  canUserAccessFile,
  getAccessList,
  getFileDetails,
} = require("../utils/blockchain");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();


exports.uploadFile = async (req, res) => {
  try {
    const { address, key, iv, type, size } = req.body; // Extract data from request
    const file = req.file; // The file sent via multipart/form-data

    // Validate input
    if (!file || !address || !key || !iv || !type || !size) {
      return res.status(400).json({ error: "File, address, key, iv, type, and size are required." });
    }

    const encryptedBuffer = file.buffer;
    const fileName = file.originalname;

    // Step 1: Upload the encrypted file to IPFS
    const cid = await uploadToIPFS(encryptedBuffer, fileName);

    // Step 2: Store file metadata on the blockchain using the updated smart contract
    await storeFileOnChain(fileName, cid);

    // Step 3: Store file metadata in Prisma (database)
    const newFile = await prisma.file.create({
      data: {
        filename: fileName,
        cid: cid,
        aesKey: key,
        aesIv: iv,
        size: size,
        type: type,
      },
    });

    // Respond with the CID and metadata
    res.json({
      message: 'File uploaded successfully',
      fileId: newFile.id,
      cid: cid,
      filename: fileName,
    });
  } catch (err) {
    console.error("Upload Error:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.getUserFileMetadata = async (req, res) => {
  try {
    const { address } = req.params;

    // Step 1: Fetch fileIds from the smart contract
    const fileIds = await fetchUserFiles(address);

    const metadata = await Promise.all(
      fileIds.map(async (fileIdBigInt) => {
        try {
          const fileIdNum = Number(fileIdBigInt.toString()); // or: fileId.toString()
          const cid = await fetchCIDFromChain(fileIdNum);;

          if (!cid ) return null;

          // Fetch corresponding metadata from Prisma using CID
          const prismaFile = await prisma.file.findFirst({
            where: { cid: cid },
          });

          // Merge and return the combined data
          return {
            fileIdNum,
            ...(prismaFile || {}), // Add Prisma fields if available
          };
        } catch (err) {
          console.warn(`Skipping fileId ${fileIdBigInt}: ${err.message}`);
          return null;
        }
      })
    );

    // Filter out failed/empty entries
    const filteredMetadata = metadata.filter((entry) => entry !== null);

    res.json({data:filteredMetadata});
  } catch (err) {
    console.error('Error fetching user file metadata:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.changePermission = async (req, res) => {
  try {
  
    const { fileId, user } = req.body;
    const hasAccess = await canUserAccessFile(fileId,user)
  
    if(hasAccess){
      await revokeFileAccess(fileId, user);
      res.json({ message: "Access revoked" });
      return
    }else{

      await grantFileAccess(fileId, user);
      res.json({ message: "Access granted" });
      return
    }

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



exports.getUserFiles = async (req, res) => {
  try {
    const { address } = req.params;
    const files = await fetchUserFiles(address);
    res.json({ files });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getFileCID = async (req, res) => {
  try {
    const { fileId, requester } = req.params;
    const cid = await fetchCIDFromChain(fileId,requester);
    res.json({ cid });
  } catch (err) {
    res.status(403).json({ error: "Unauthorized" });
  }
};

exports.downloadEncryptedFile = async (req, res) => {
  try {
    const { cid, address, fileId } = req.body;

const fetchedCID = await fetchCIDFromChain(fileId,address);

    if (fetchedCID !== cid) {
     
      return res.status(403).json({ error: "Unauthorized file access" });
    }

    const data = await downloadFromIPFS(cid);

    res.setHeader("Content-Disposition", "attachment; filename=encrypted_file");
    res.setHeader("Content-Type", "application/octet-stream");

    res.send(data);
  } catch (error) {
    console.error("Download failed:", error.message);
    const err = error.message ? error.message : "File download failed";
    res.status(500).json({ error: { message: err } });
  }
};

exports.storeUserToAccessList = async (req, res) => {
  const { fileId, recipientAddress, senderAddress } = req.body;
  if (isValidAddress(senderAddress) || isValidAddress(recipientAddress)) {
    return res.status(400).json({ message: "Invalid address format." });
  }
  try {
    await grantFileAccess(fileId, recipientAddress);

    res
      .status(200)
      .json({ message: `File shared successfully with ${recipientAddress}` });
  } catch (error) {
    console.error("Error sharing file:", error);
    res.status(500).json({ message: "Error sharing file." });
  }
};

exports.hasAccess = async (req, res) => {
  const { id, requester, fileId } = req.params;
 
  try {
    const file = await prisma.file.findUnique({
      where: { id: Number(id) },
    });

    // Verify if the recipient has access to the file

    const hasAccess = await canUserAccessFile(fileId, requester);

    if (!hasAccess) {
      res.json({
        success: false,
        message:
          "⚠️ Access to this file has been removed by the owner. You no longer have permission to view or download it.",
      });
      return;
    }

    return res.status(200).json({
      cid: file.cid,
      name: file.filename,
      size: file.size,
      type: file.type,
      aesIV: file.aesIv,
      aesKey: file.aesKey,
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving file" });
  }
};

exports.getUsersAccessList = async (req, res) => {
  try {
    const { address } = req.params;
    
    const files = await fetchUserFiles(address);
    
    const filesAsStrings = files.map((f) => f.toString());
  
    const filesWithAccessList = await Promise.all(
      filesAsStrings.map(async (fileId) => {
        const accessList = await getAccessList(fileId);
       
        return accessList ? { accessList, fileId } : { fileId };
      })
    );
  
    res.json({ filesWithAccessList });
  } catch (error) {
    console.error("Error fetching access list:", error);
    res.status(500).json({ error: "Failed to retrieve access list" });
  }
  
};

function isValidAddress(address) {
  return !/^0x[a-fA-F0-9]{40}$/.test(address);
}
