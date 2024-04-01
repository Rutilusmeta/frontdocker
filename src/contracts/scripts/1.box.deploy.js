const { ethers, upgrades } = require("hardhat");

async function main() {

  // Get the contract factory for Box
  const Box = await ethers.getContractFactory("Box");

  // Deploy the Box contract with proxy
  const box = await upgrades.deployProxy(Box, [42], { initializer: 'store' });

  //console.log(box, "object");

  console.log("Box deployed to:", box.target);
}

// Execute the deployment script
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

  /*async function main() {

  const Box = await ethers.getContractFactory("Box")
  console.log("Deploying Box...")
  const box = await upgrades.deployProxy(Box,[42], { initializer: 'store' })

  console.log(box.address," box(proxy) address")
  console.log(await upgrades.erc1967.getImplementationAddress(box.address)," getImplementationAddress")
  console.log(await upgrades.erc1967.getAdminAddress(box.address)," getAdminAddress")    
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})*/
