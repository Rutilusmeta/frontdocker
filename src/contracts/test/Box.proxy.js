// test/Box.proxy.js
const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");

let Box;
let box;

// Start test block
describe('Box (proxy)', function () {
  beforeEach(async function () {
    Box = await ethers.getContractFactory("Box");
    box = await upgrades.deployProxy(Box, [42], { initializer: 'store' });
  });

  // Test case
  it('retrieve returns a value previously initialized', async function () {
    // Test if the returned value is the same one
    // Note that we need to use strings to compare the 256 bit integers
    expect((await box.retrieve()).toString()).to.equal('42');
    await box.store(100)
    expect((await box.retrieve()).toString()).to.equal('100');
  });
});
