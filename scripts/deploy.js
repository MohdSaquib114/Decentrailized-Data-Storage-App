const main = async () => {
    const StorageContract = await hre.ethers.getContractFactory("StorageContract"); // Must match .sol file name!
    const contract = await StorageContract.deploy();

    await contract.waitForDeployment();

    const contractAddress = await contract.getAddress(); 
    console.log("StorageContract deployed to:", contractAddress);
  };
  
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