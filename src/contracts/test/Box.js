// test/Box.js
const { expect } = require('chai');
const { ethers } = require('hardhat');
const { Contract, BigNumber } = require('ethers');

describe('Box', function () {
  let Box;
  let box;

  beforeEach(async function () {
    Box = await ethers.getContractFactory('Box');
    box = await Box.deploy();
  });

  it("should retrieve value previously stored", async function () {
    await box.store(42)
    expect(await box.retrieve()).to.equal('42');

    await box.store(100)
    expect(await box.retrieve()).to.equal('100');
  })
});
