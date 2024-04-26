require('dotenv').config();

const{ ethers, upgrades } = require("hardhat");

const proxyAddress = process.env.REACT_APP_CONTRACT_PROXY_ADDRESS;

async function main() {
  console.log(proxyAddress," original NFTMarketplace(proxy) address");
  const NFTMarketplaceV2 = await ethers.getContractFactory("NFTMarketplaceV2");

  console.log("upgrade to NFTMarketplaceV2...");
  const nftmarketplaceV2 = await upgrades.upgradeProxy(proxyAddress, NFTMarketplaceV2);
  console.log(nftmarketplaceV2.target,"NFTMarketplaceV2 address(should be the same)");
}

// Execute the deployment script
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
