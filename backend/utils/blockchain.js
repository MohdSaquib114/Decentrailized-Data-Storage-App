const { ethers } = require('ethers');
const fileManagerABI = require('../abis/FileManager.json');
const userManagerABI = require('../abis/UserManager.json');
require("dotenv").config();

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
 const fileManager = new ethers.Contract(process.env.FILE_MANAGER_ADDRESS, fileManagerABI.abi, signer);
 const userManager = new ethers.Contract(process.env.USER_MANAGER_ADDRESS, userManagerABI.abi, signer);

exports.registerUserOnChain = async (address) => {
  const tx = await userManager.registerUser({ from: address });
  await tx.wait();
};

exports.checkUserOnChain = async (address) => {
  return await userManager.isRegistered(address);
};

exports.storeFileOnChain = async (cid, address) => {
  const tx = await fileManager.uploadFile(cid, { from: address });
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

exports.fetchUserFiles = async (address) => {
  return await fileManager.getMyFiles({ from: address });
};

exports.fetchCIDFromChain = async (fileId, requester) => {
  return await fileManager.getFileCID(fileId, requester);
};
