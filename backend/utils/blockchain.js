const { ethers } = require('ethers');
const fileManagerABI = require('../abis/FileManager.json');
const userManagerABI = require('../abis/UserManager.json');
require("dotenv").config();

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const fileManager = new ethers.Contract(
  process.env.FILE_MANAGER_ADDRESS,
  fileManagerABI.abi,
  signer
);

const userManager = new ethers.Contract(
  process.env.USER_MANAGER_ADDRESS,
  userManagerABI.abi,
  signer
);


// UserManager logic
exports.registerUserOnChain = async () => {
  const tx = await userManager.registerUser();
  await tx.wait();
};

exports.checkUserOnChain = async (address) => {
  return await userManager.isRegistered(address);
};


// FileManager logic
exports.storeFileOnChain = async (cid) => {
  const tx = await fileManager.uploadFile(cid);
  await tx.wait();
};


exports.grantFileAccess = async (fileId, user) => {
  const tx = await fileManager.grantAccess(fileId, user);
  await tx.wait();
};

exports.revokeFileAccess = async (fileId, user) => {
  const tx = await fileManager.revokeAccess(fileId, user);
  await tx.wait();
};

exports.fetchUserFiles = async () => {
  return await fileManager.getMyFiles();
};

exports.fetchCIDFromChain = async (fileId) => {
  return await fileManager.getFileCID(fileId, signer.address);
};

exports.canUserAccessFile = async (fileId, userAddress) => {
  return await fileManager.canAccess(fileId, userAddress);
};

exports.getAccessList = async (fileId) => {
  return await fileManager.getAccessList(fileId);
};

exports.getFileDetails = async (fileId) => {
  return await fileManager.getFile(fileId); // returns [cid, owner]
};

exports.getFileOwner = async (fileId) => {
  return await fileManager.getFileOwner(fileId);
};
