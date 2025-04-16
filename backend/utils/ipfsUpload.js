const pinataSDK = require('@pinata/sdk'); 
const fs = require('fs'); 
const path = require('path'); 
require('dotenv').config();

// Initialize Pinata client with your API keys
const pinata = new pinataSDK({
    pinataApiKey: process.env.PINATA_API_KEY,
    pinataSecretApiKey: process.env.PINATA_SECRET_KEY,
  });


  async function uploadFileToIPFS(filePath,originalFileName) {
    const readableStreamForFile = fs.createReadStream(filePath);
    const options = {
        pinataMetadata: {
          name: originalFileName || 'uploaded-file', // ✅ this is required
        },
        pinataOptions: {
          cidVersion: 0,
        },
      };
    
    try {
     const result = await pinata.pinFileToIPFS(readableStreamForFile, options);
      return result.IpfsHash;
    } catch (error) {
      console.error('Error uploading file to IPFS:', error);
      throw new Error('Failed to upload file to IPFS');
    }
  }

module.exports = { uploadFileToIPFS, };