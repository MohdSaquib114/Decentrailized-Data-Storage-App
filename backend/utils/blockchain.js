const { ethers } = require('ethers');
const fileManagerABI = require('../abis/FileManager.json');

require("dotenv").config();

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const fileManager = new ethers.Contract(
  process.env.FILE_MANAGER_ADDRESS,
  fileManagerABI.abi,
  signer
);
const readOnlyFileManager = new ethers.Contract(
  process.env.FILE_MANAGER_ADDRESS,
  fileManagerABI.abi,
  provider // no signer for read-only
);

// FileManager logic

// Store file metadata on-chain
exports.storeFileOnChain = async (filename, cid) => {
  // Calling uploadFile method with filename and CID
  const tx = await fileManager.uploadFile(cid, filename);
  await tx.wait(); // Wait for the transaction to be mined
};

// Grant access to a file
exports.grantFileAccess = async (fileId, user) => {
  const tx = await fileManager.grantAccess(fileId, user);
  await tx.wait(); // Wait for the transaction to be mined
};

// Revoke access to a file
exports.revokeFileAccess = async (fileId, user) => {
  const tx = await fileManager.revokeAccess(fileId, user);
  await tx.wait(); // Wait for the transaction to be mined
};

// Fetch the list of file IDs associated with the user's address
exports.fetchUserFiles = async (address) => {
  try {
    // No need to pass address, just call as the user context is inferred
    // const signerConnected = readOnlyFileManager.connect(provider);
    const fileIds = await fileManager.getMyFiles(); // or just: await readOnlyFileManager.getMyFiles()
    return fileIds;
  } catch (err) {
    console.error('Error fetching user files:', err);
    return [];
  }
};

// Fetch file CID from the blockchain based on file ID
exports.fetchCIDFromChain = async (fileId) => {
  const [filename, cid] = await fileManager.getFile(fileId);
  return cid; // Return CID
};

// Check if a user has access to a specific file
exports.canUserAccessFile = async (fileId, userAddress) => {
  
  const file = await fileManager.getFile(fileId);
  return file.grantedAddresses.includes(userAddress); // Check if the user is in the access list
};

// Get the access list of a specific file
exports.getAccessList = async (fileId) => {
  const file = await fileManager.getFile(fileId);
  return file.grantedAddresses; // Return the access list
};

// Fetch detailed file metadata (including owner, createdAt, updatedAt, etc.)
exports.getFileDetails = async (fileId) => {
  try {
    const [filename, cid, createdAt, updatedAt, owner] = await fileManager.getFile(fileId);
    
    // Return metadata as an object
    return {
      filename,
      cid,
      createdAt: new Date(createdAt * 1000), // Convert UNIX timestamp to Date
      updatedAt: new Date(updatedAt * 1000), // Convert UNIX timestamp to Date
      owner,
    };
  } catch (error) {
    console.error(`Failed to fetch metadata for fileId ${fileId}:`, error);
    return null;
  }
};

// Fetch the owner of the file based on fileId
exports.getFileOwner = async (fileId) => {
  const file = await fileManager.getFile(fileId);
  return file.owner; // Return the file owner address
};
