// const main = async () => {
//     const StorageContract = await hre.ethers.getContractFactory("StorageContract"); // Must match .sol file name!
//     const contract = await StorageContract.deploy();

//     await contract.waitForDeployment();

//     const contractAddress = await contract.getAddress(); 
//     console.log("StorageContract deployed to:", contractAddress);
//   };
const { ethers } = require("hardhat");

async function main() { // Deploy FileManager contract 
          const FileManager = await ethers.getContractFactory("FileManager");
          const fileManager = await FileManager.deploy(); 
          await fileManager.waitForDeployment();
            const fileManagerAddress = await fileManager.getAddress();
            console.log("FileManager deployed to:", fileManagerAddress);

          // Deploy UserManager contract
          const UserManager = await ethers.getContractFactory("UserManager");
            const userManager = await UserManager.deploy(); 
            await userManager.waitForDeployment();
            const userManagerAddress = await userManager.getAddress(); 
            console.log("UserManager deployed to:", userManagerAddress);
   }
  const runMain = async () => {
    try {
      await main();
      process.exit(0);
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  };
  
  runMain();

