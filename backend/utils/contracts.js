// backend/utils/contracts.js
const { ethers } = require("ethers");
require("dotenv").config();

// Load contract ABI
const FileManagerABI = require('../contracts/FileManager.json'); // Path to the ABI
const contractAddress = process.env.FILE_MANAGER_CONTRACT_ADDRESS; // Make sure to add this to .env

// Initialize Ethereum provider (Infura, Alchemy, or your own node)
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL); // Set RPC URL in .env

// Set up signer with your private key (for interacting with the contract)
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// Get the contract instance
const fileManagerContract = new ethers.Contract(contractAddress, FileManagerABI.abi, signer);

// Function to store CID on-chain
async function storeCIDOnChain(cid) {
  try {
    const transaction = await fileManagerContract.uploadFile(cid);
    console.log('Transaction sent:', transaction.hash);
    const receipt = await transaction.wait();
    return receipt;
  } catch (error) {
    console.error('Error storing CID:', error);
    throw error;
  }
}


async function grantFileAccess(fileId, userAddress) {
  try {
    const tx = await fileManagerContract.grantAccess(fileId, userAddress);
    console.log("Grant access tx:", tx.hash);
    const receipt = await tx.wait();
    return receipt;
  } catch (error) {
    console.error("Error granting access:", error);
    throw error;
  }
}

async function revokeFileAccess(fileId, userAddress) {
  try {
    const tx = await fileManagerContract.revokeAccess(fileId, userAddress);
    console.log("Revoke access tx:", tx.hash);
    const receipt = await tx.wait();
    return receipt;
  } catch (error) {
    console.error("Error revoking access:", error);
    throw error;
  }
}

async function canUserAccess(fileId, userAddress) {
  try {
    const result = await fileManagerContract.canAccess(fileId, userAddress);
    return result;
  } catch (error) {
    console.error("Error checking access:", error);
    throw error;
  }
}

async function getFileCID(fileId) {
  try {
    const cid = await fileManagerContract.getFileCID(fileId);
    return cid;
  } catch (error) {
    console.error("Error getting file CID:", error);
    throw error;
  }
}

async function getFileMetadata(fileId) {
  try {
    const [cid, owner] = await fileManagerContract.getFile(fileId);
    return { cid, owner };
  } catch (error) {
    console.error("Error getting file metadata:", error);
    throw error;
  }
}

async function getMyFiles() {
  try {
    const files = await fileManagerContract.getMyFiles();
    return files;
  } catch (error) {
    console.error("Error fetching user's files:", error);
    throw error;
  }
}


module.exports = {
  storeCIDOnChain,
  grantFileAccess,
  revokeFileAccess,
  canUserAccess,
  getFileCID,
  getFileMetadata,
  getMyFiles
};

