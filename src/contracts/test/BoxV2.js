// test/Box.js
const { expect } = require('chai');
const { ethers } = require('hardhat');
const { Contract, BigNumber } = require('ethers');

describe('Box', function () {
  let BoxV2;
  let boxV2;

  beforeEach(async function () {
    const BoxV2 = await ethers.getContractFactory("BoxV2")
    boxV2 = await BoxV2.deploy()
  });

  it("should retrieve value previously stored", async function () {
    await boxV2.store(42)
    expect(await boxV2.retrieve()).to.equal('42');

    await boxV2.store(100)
    expect(await boxV2.retrieve()).to.equal('100');
  })

  it('should increment value correctly', async function () {
    await boxV2.store(42);
    await boxV2.increment();
    expect(await boxV2.retrieve()).to.equal('43');
  })

});
