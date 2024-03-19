// Help Truffle find `TruffleTutorial.sol` in the `/contracts` directory
const NFTMarketplace = artifacts.require("NFTMarketplace");

module.exports = function(deployer) {
  // Command Truffle to deploy the Smart Contract
  deployer.deploy(NFTMarketplace);
};