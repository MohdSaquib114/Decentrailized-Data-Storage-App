import { ethers } from "ethers";
import Web3Modal from "web3modal";
import { WalletConnectProvider } from "@walletconnect/client";

let provider;
let signer;
let contract;

const contractAddress = "YOUR_CONTRACT_ADDRESS"; // Replace with your deployed contract address
const contractABI = [
  // Add your contract ABI here
];

const ALCHEMY_API_URL = "https://eth-mainnet.alchemyapi.io/v2/YOUR_ALCHEMY_API_KEY"; // Replace with your Alchemy API URL

export async function connectWallet() {
  const web3Modal = new Web3Modal({
    cacheProvider: true,
    providerOptions: {
      injected: {
        package: null, // Injected provider (MetaMask, etc.)
      },
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          rpc: {
            1: ALCHEMY_API_URL, // Mainnet RPC URL
            3: "https://eth-ropsten.alchemyapi.io/v2/YOUR_ALCHEMY_API_KEY", // Testnet RPC URL
          },
          infuraId: "INFURA_PROJECT_ID", // Optional, only needed if you want to support Infura as well
        },
      },
    },
  });

  const instance = await web3Modal.connect();
  provider = new ethers.providers.Web3Provider(instance);
  signer = provider.getSigner();
  contract = new ethers.Contract(contractAddress, contractABI, signer);
}

// Get the current signer (connected wallet)
export function getSigner() {
  return signer;
}

// Get the current provider (connected network)
export function getProvider() {
  return provider;
}

// Upload a file and store CID and file hash on the blockchain
export async function uploadFile(cid, fileHash) {
  try {
    const transaction = await contract.uploadFile(cid, fileHash);
    await transaction.wait();
    console.log("File uploaded with CID:", cid, "and fileHash:", fileHash);
  } catch (error) {
    console.error("Error uploading file:", error);
  }
}

// Get file metadata (CID, fileHash, and owner)
export async function getFileMetadata(cid) {
  try {
    const metadata = await contract.getFile(cid);
    return metadata; // Returns cid, owner, and fileHash
  } catch (error) {
    console.error("Error getting file metadata:", error);
  }
}

// Grant access to a file
export async function grantAccess(cid, userAddress) {
  try {
    const transaction = await contract.grantAccess(cid, userAddress);
    await transaction.wait();
    console.log("Access granted to:", userAddress);
  } catch (error) {
    console.error("Error granting access:", error);
  }
}

// Revoke access from a file
export async function revokeAccess(cid, userAddress) {
  try {
    const transaction = await contract.revokeAccess(cid, userAddress);
    await transaction.wait();
    console.log("Access revoked from:", userAddress);
  } catch (error) {
    console.error("Error revoking access:", error);
  }
}

// Check if a user has access to a file
export async function checkAccess(cid, userAddress) {
  try {
    const access = await contract.hasAccess(cid, userAddress);
    return access;
  } catch (error) {
    console.error("Error checking access:", error);
  }
}

// Get all files uploaded by a user
export async function getUserFiles(userAddress) {
  try {
    const files = await contract.getUserFiles(userAddress);
    return files;
  } catch (error) {
    console.error("Error getting user files:", error);
  }
}

// Track file access by a user
export async function trackFileAccess(cid) {
  try {
    const transaction = await contract.trackFileAccess(cid, await signer.getAddress());
    await transaction.wait();
    console.log("File access tracked for:", cid);
  } catch (error) {
    console.error("Error tracking file access:", error);
  }
}

// Get the access history of a file
export async function getAccessHistory(cid) {
  try {
    const accessHistory = await contract.getAccessHistory(cid);
    return accessHistory; // Returns access history (addresses and timestamps)
  } catch (error) {
    console.error("Error getting access history:", error);
  }
}

// Delete a file and remove all associated data
export async function deleteFile(cid) {
  try {
    const transaction = await contract.deleteFile(cid);
    await transaction.wait();
    console.log("File deleted:", cid);
  } catch (error) {
    console.error("Error deleting file:", error);
  }
}
