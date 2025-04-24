const { uploadToIPFS, downloadFromIPFS } = require("../utils/pinata");
const {
  storeFileOnChain,
  grantFileAccess,
  revokeFileAccess,
  fetchUserFiles,
  fetchCIDFromChain,
  checkUserOnChain,
  canUserAccessFile,
  getAccessList,
  getFileDetails,
} = require("../utils/blockchain");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

exports.uploadFile = async (req, res) => {
  try {
    const { address, key, iv, type, size } = req.body;
    const file = req.file;
    if (!file || !address || !key || !iv) {
      return res
        .status(400)
        .json({ error: "File, address, key, and iv are required." });
    }

    const encryptedBuffer = file.buffer;
    const fileName = file.originalname;

    // Upload encrypted buffer to IPFS
    const cid = await uploadToIPFS(encryptedBuffer, fileName);

    // Store CID on chain
    await storeFileOnChain(cid, address);

    const newFile = await prisma.file.create({
      data: {
        filename: fileName,
        cid: cid,
        aesKey: key, // Store the key
        aesIv: iv, // Store the IV
        type: type,
        size: size,
      },
    });

    res.json({ cid: cid });
  } catch (err) {
    console.error("Upload Error:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.getUserFileMetadata = async (req, res) => {
  try {
    const { address } = req.params;
    // 1. Check if user is registered on-chain
    const isRegistered = await checkUserOnChain(address);
    if (!isRegistered) {
      return res
        .status(401)
        .json({ error: "User not registered on blockchain" });
    }

    // 2. Fetch file IDs from FileManager contract
    const fileIds = await fetchUserFiles(address);

    for (let fileId of fileIds) {
      const numericId = Number(fileId);
      const cid = await fetchCIDFromChain(numericId, address);
    }
    // 3. Fetch file metadata from DB for all these CIDs
    const metadata = await Promise.all(
      fileIds.map(async (fileIdBigInt) => {
        try {
          const fileId = Number(fileIdBigInt);

          const cid = await fetchCIDFromChain(fileId, address);

          const file = await prisma.file.findFirst({
            where: { cid },
          });
          return file ? { ...file, fileId } : null;
        } catch (err) {
          console.warn(`Skipping fileId ${fileIdBigInt}: ${err.message}`);
          return null;
        }
      })
    );

    res.json({ files: metadata.filter(Boolean) });
  } catch (err) {
    console.error("Metadata fetch error:", err);
    res.status(500).json({ error: "Internal Server Error" });
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
    const cid = await fetchCIDFromChain(fileId, requester);
    res.json({ cid });
  } catch (err) {
    res.status(403).json({ error: "Unauthorized" });
  }
};

exports.downloadEncryptedFile = async (req, res) => {
  try {
    const { cid, address, fileId } = req.body;

    const isRegistered = await checkUserOnChain(address);

    if (!isRegistered) {
      return res
        .status(401)
        .json({ error: "User not registered on blockchain" });
    }

    const fetchedCID = await fetchCIDFromChain(Number(fileId), address);

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
