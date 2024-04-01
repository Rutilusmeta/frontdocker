require('dotenv').config();

const{ ethers, upgrades } = require("hardhat");

const proxyAddress = process.env.REACT_APP_CONTRACT_PROXY_ADDRESS;

async function main() {
  console.log(proxyAddress," original Box(proxy) address");
  const BoxV2 = await ethers.getContractFactory("BoxV2");

  console.log("upgrade to BoxV2...");
  const boxV2 = await upgrades.upgradeProxy(proxyAddress, BoxV2);
  console.log(boxV2.target," BoxV2 address(should be the same)");
}

// Execute the deployment script
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
