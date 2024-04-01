require('dotenv').config();

require("@nomicfoundation/hardhat-toolbox");
require('@openzeppelin/hardhat-upgrades');

module.exports = {
  //defaultNetwork: "ganache",
  networks: {
    //"hardhat": {
    //  allowUnlimitedContractSize: true
    //},
    "dev": {
      chainId: parseInt(process.env.REACT_APP_CHAIN_DEV_ID),
      url: process.env.REACT_APP_CHAIN_DEV_ADDRESS,
      allowUnlimitedContractSize: true
      // accounts: [privateKey1, privateKey2, ...]
    }
  },
  solidity: "0.8.18",
  /*settings: {
    optimizer: {
      enabled: true,
      runs: 1000,
    },
  },*/
  paths: {
    artifacts: "./src/contracts/abi/",
    tests: "./src/contracts/test",
    cache: "./src/contracts/cache",
    //sources: "./src/contracts/solidity"
  }
};
