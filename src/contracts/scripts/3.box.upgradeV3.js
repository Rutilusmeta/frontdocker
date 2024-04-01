require('dotenv').config();

const { ethers, upgrades } = require("hardhat");

const proxyAddress = process.env.REACT_APP_CONTRACT_PROXY_ADDRESS;

async function main() {
  console.log(proxyAddress," original Box(proxy) address")
  const BoxV3 = await ethers.getContractFactory("BoxV3")
  console.log("upgrade to BoxV3...")
  const boxV3 = await upgrades.upgradeProxy(proxyAddress, BoxV3)
  console.log(boxV3.target," BoxV3 address(should be the same)")
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})