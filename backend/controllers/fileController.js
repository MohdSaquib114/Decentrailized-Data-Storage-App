

const { uploadToIPFS } = require('../utils/pinata');
const { storeFileOnChain, grantFileAccess, revokeFileAccess, fetchUserFiles, fetchCIDFromChain ,checkUserOnChain} = require('../utils/blockchain');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.uploadFile = async (req, res) => {
    try {
      const { address, key, iv,type,size } = req.body;
      const file = req.file;
      if (!file || !address || !key || !iv) {
        return res.status(400).json({ error: "File, address, key, and iv are required." });
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
          aesKey: key,  // Store the key
          aesIv: iv,    // Store the IV
          type: type,
          size: size
        },
      });
  
      res.json({ cid:cid });
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
        return res.status(401).json({ error: 'User not registered on blockchain' });
      }
  
      // 2. Fetch file IDs from FileManager contract
      const fileIds = await fetchUserFiles(address);
      console.log("sdsd",fileIds)
      for (let fileId of fileIds) {
        const numericId = Number(fileId);
        const cid = await fetchCIDFromChain(numericId, address);
        console.log(`fileId: ${numericId} -> cid: ${cid}`);
      }
      // 3. Fetch file metadata from DB for all these CIDs
      const metadata = await Promise.all(
        fileIds.map(async (fileIdBigInt) => {
          try {
            const fileId = Number(fileIdBigInt);
            console.log(fileId)
            const  cid  = await fetchCIDFromChain(fileId, address);
            console.log(cid)
            const file = await prisma.file.findUnique({
              where: { cid }
            });
            return file ? { ...file, fileId } : null;
          } catch (err) {
            console.warn(`Skipping fileId ${fileIdBigInt}: ${err.message}`);
            return null;
          }
        })
      );
  console.log(metadata)
      res.json({ files: metadata.filter(Boolean) });
    } catch (err) {
      console.error('Metadata fetch error:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  

exports.grantAccess = async (req, res) => {
  try {
    const { fileId, user } = req.body;
    await grantFileAccess(fileId, user);
    res.json({ message: 'Access granted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.revokeAccess = async (req, res) => {
  try {
    const { fileId, user } = req.body;
    await revokeFileAccess(fileId, user);
    res.json({ message: 'Access revoked' });
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
    res.status(403).json({ error: 'Unauthorized' });
  }
};
