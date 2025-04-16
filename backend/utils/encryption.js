const crypto = require("crypto"); 
const fs = require("fs"); const path = require("path");

const algorithm = "aes-256-cbc"; 
// const key = crypto.randomBytes(32); 

function encryptFile(inputPath, outputPath, key) {
    return new Promise((resolve, reject) => {
        const key = crypto.randomBytes(32)
      const iv = crypto.randomBytes(16); // Generate IV for AES encryption
      const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key, 'hex'), iv);
  
      const input = fs.createReadStream(inputPath);
      const output = fs.createWriteStream(outputPath);
  
      output.write(iv); // Prepend the IV to the file
  
      // Pipe input file through cipher and output to a new encrypted file
      input.pipe(cipher).pipe(output);
  
      output.on('finish', resolve); // Resolve when encryption is complete
      output.on('error', reject);  // Reject if an error occurs
    });
  }

function decryptFile(inputPath, outputPath) { 
    const decipher = crypto.createDecipheriv(algorithm, key, iv); 
    const input = fs.createReadStream(inputPath); 
    const output = fs.createWriteStream(outputPath);

input.pipe(decipher).pipe(output);
 }

function getEncryptionKey() { 
    return { key: key.toString("hex"), iv: iv.toString("hex") };
 }

module.exports = { encryptFile, decryptFile, getEncryptionKey, };