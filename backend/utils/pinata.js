const pinataSDK = require('@pinata/sdk'); 
const fs = require('fs'); 
const path = require('path'); 
const axios = require("axios")
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

  const delay = (ms) => new Promise(res => setTimeout(res, ms));

exports.downloadFromIPFS = async (  cid) => {
  const url = `https://gateway.pinata.cloud/ipfs/${cid}`;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await axios.get(url, { responseType: 'arraybuffer' });
      return response.data;
    } catch (err) {
      if (err.response?.status === 429) {
       
        await delay(1000); // wait 1s
      } else {
        throw err;
      }
    }
  }
  throw new Error('Download failed after multiple attempts.');
}
