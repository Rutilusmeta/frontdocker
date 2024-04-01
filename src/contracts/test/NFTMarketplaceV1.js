const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('NFTMarketplace', function () {
  let NFTMarketplace;
  let marketplace;
  let ownerAddress;

  beforeEach(async function () {
    NFTMarketplace = await ethers.getContractFactory('NFTMarketplace');
    marketplace = await NFTMarketplace.deploy();
    //await marketplace.deployed(); // Ensure the contract is deployed
    [ownerAddress] = await ethers.getSigners();
  });

  it("should create a new token and market item", async function () {
    // Create a new token
    const tokenId = await marketplace.createToken("TokenURI", ethers.parseUnits("2", "ether"), "0x4E90a36B45879F5baE71B57Ad525e817aFA54890");
    const tokenId_q = await marketplace.createToken("TokenURI1", ethers.parseUnits("3", "ether"), "0x4E90a36B45879F5baE71B57Ad525e817aFA54890");
   
    console.log(ownerAddress.address);
   // Retrieve market items by owner
    const ownerMarketItems = await marketplace.getMarketItems("0x0000000000000000000000000000000000000000");

    console.log(ownerMarketItems.length);

    for(let item of ownerMarketItems) {
      console.log("Token ID:", item.tokenId);
      console.log("Collection Address:", item.collectionAddress);
      console.log("Seller:", item.seller);
      console.log("Owner:", item.owner);
      console.log("Price:", item.price.toString());
      console.log("Sold:", item.sold);
      console.log("TokenUri:", item.tokenURI);
      console.log("----------------------------------");
    }
    

    // Ensure that the owner has the correct number of market items
    //expect(ownerMarketItems.length).to.equal(1);
   
    //const rc = await tokenId.wait()

  //console.log(rc);

    // Retrieve the created market item
    //const marketItem = await marketplace.getMarketItem(tokenId);

    // Assert that the market item is created with the correct values
    /*expect(marketItem.tokenId).to.equal(tokenId);
    expect(marketItem.collectionAddress).to.equal("0x301E1528bAD61177eF8Ff89bD4ad6760581e5409");
    expect(marketItem.seller).to.equal(await ethers.provider.getSigner(0).getAddress());
    expect(marketItem.owner).to.equal(await marketplace.address);
    expect(marketItem.price).to.equal(ethers.utils.parseUnits("1", "ether"));
    expect(marketItem.sold).to.equal(false);*/
  });
});
