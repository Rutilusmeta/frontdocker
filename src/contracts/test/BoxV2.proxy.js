const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");

let Box;
let box;
let boxV2;

// Start test block
describe('Box (proxy)', function () {
  beforeEach(async function () {
    Box = await ethers.getContractFactory("Box");
    const BoxV2 = await ethers.getContractFactory("BoxV2")
    box = await upgrades.deployProxy(Box, [42], { initializer: 'store' });
    boxV2 = await upgrades.upgradeProxy(box.target, BoxV2);
  });

  // Test case
  it('retrieve returns a value previously initialized', async function () {
    // Test if the returned value is the same one
    // Note that we need to use strings to compare the 256 bit integers
    expect((await boxV2.retrieve()).toString()).to.equal('42');

    await boxV2.increment()
    expect(await boxV2.retrieve()).to.equal('43');

    await box.store(100)
    expect((await box.retrieve()).toString()).to.equal('100');
  });
});
