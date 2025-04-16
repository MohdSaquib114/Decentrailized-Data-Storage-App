// backend/routes/files.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { encryptFile } = require('../utils/encryption'); // Import encryption logic
const { uploadFileToIPFS } = require('../utils/ipfsUpload'); // Import IPFS upload logic
const { storeCIDOnChain,checkAccess ,grantAccessOnChain,revokeAccessOnChain   } = require('../utils/contracts');

const router = express.Router();

// Multer setup for file uploads
const upload = multer({ dest: 'uploads/' });

// Handle file upload
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const originalPath = req.file.path; // Path of uploaded file
    const encryptedPath = `${originalPath}_encrypted`; // Path for the encrypted file

    // Encrypt file using the provided AES key
    const key = req.body.key; // Client should send AES key in request
    await encryptFile(originalPath, encryptedPath, key);
    const originalFileName = req.file.originalname; 
    // Upload encrypted file to IPFS and get the CID
    const cid = await uploadFileToIPFS(encryptedPath,originalFileName );
    
    // Store the CID on-chain
    const fileName = req.file.originalname; // Store the original file name
    const userAddress = req.body.userAddress; // User's Ethereum address
 
    const receipt = await storeCIDOnChain(cid);

    // Cleanup temporary files
    fs.unlinkSync(originalPath);
    fs.unlinkSync(encryptedPath);

       // Return the CID and transaction receipt
    return res.json({ success: true, cid, transactionReceipt: receipt });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'File upload failed' });
  }
});

router.post('/grant-access', async (req, res) => {
    const { fileId, userAddress } = req.body;
  
    try {
      const receipt = await grantAccessOnChain(fileId, userAddress);
      res.status(200).json({ message: 'Access granted', receipt });
    } catch (error) {
      res.status(500).json({ message: 'Error granting access', error });
    }
  });

  router.post('/revoke-access', async (req, res) => {
    const { fileId, userAddress } = req.body;
  
    try {
      const receipt = await revokeAccessOnChain(fileId, userAddress);
      res.status(200).json({ message: 'Access revoked', receipt });
    } catch (error) {
      res.status(500).json({ message: 'Error revoking access', error });
    }
  });

  router.get('/check-access', async (req, res) => {
    const { fileId, userAddress } = req.query;
  
    try {
      const hasAccess = await checkAccess(fileId, userAddress);
      res.status(200).json({ message: `User has access: ${hasAccess}`, hasAccess });
    } catch (error) {
      res.status(500).json({ message: 'Error checking access', error });
    }
  });

module.exports = router;
