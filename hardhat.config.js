require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({ path: "./backend/.env" }); 
module.exports = {
  solidity: "0.8.20",
  networks: {
    goerli: {
      url: `hhttps://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
      accounts: [`0x${process.env.PRIVATE_KEY}`],
    }
  }
};


