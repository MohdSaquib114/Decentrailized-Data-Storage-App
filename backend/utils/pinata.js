const pinataSDK = require('@pinata/sdk'); 
const fs = require('fs'); 
const path = require('path'); 
require('dotenv').config();

// Initialize Pinata client with your API keys
const pinata = new pinataSDK({
    pinataApiKey: process.env.PINATA_API_KEY,
    pinataSecretApiKey: process.env.PINATA_SECRET_KEY,
  });

  exports.uploadToIPFS = async (encryptedBuffer, fileName = 'encrypted-file') => {
    try {
      const options = {
        pinataMetadata: {
          name: fileName,
          keyvalues: {
            project: 'etherStore',
            uploadedAt: new Date().toISOString(),
          }
        },
        pinataOptions: {
          cidVersion: 1,
        }
      };
  
      const result = await pinata.pinFileToIPFS(
        BufferToStream(encryptedBuffer),
        options
      );
  
      return result.IpfsHash; // CID
    } catch (err) {
      throw new Error('IPFS Upload failed: ' + err.message);
    }
  };
  
  // Helper to convert buffer to stream
  const { Readable } = require('stream');
  const BufferToStream = (buffer) => {
    const readable = new Readable();
    readable._read = () => {};
    readable.push(buffer);
    readable.push(null);
    return readable;
  };