const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");

describe("Box (proxy) V4 with getName", function () {
  let box;
  let boxV2;
  let boxV3;
  let boxV4;

  beforeEach(async function () {
    const Box = await ethers.getContractFactory("Box");
    const BoxV2 = await ethers.getContractFactory("BoxV2");
    const BoxV3 =  await ethers.getContractFactory("BoxV3");
    const BoxV4 =  await ethers.getContractFactory("BoxV4");
    //initialize with 42
    box = await upgrades.deployProxy(Box, [42], {initializer: 'store'});
    boxV2 = await upgrades.upgradeProxy(box.target, BoxV2);
    boxV3 = await upgrades.upgradeProxy(box.target, BoxV3);
    boxV4 = await upgrades.upgradeProxy(box.target, BoxV4);
  });

  it("should retrieve value previously stored and increment correctly", async function () {
    expect(await boxV4.retrieve()).to.equal('42');
    await boxV4.increment();
    expect(await boxV4.retrieve()).to.equal('43');
    await boxV2.store(100);
    expect(await boxV2.retrieve()).to.equal('100');
  });

  it("should setName and getName correctly in V4", async function () {
    //name() removed, getName() now
    await boxV4.setName("");
    expect(await boxV4.getName()).to.equal("Name: ");
    const boxname = "my Box V4";
    await boxV4.setName(boxname);
    expect(await boxV4.getName()).to.equal("Name: my Box V4");

    });
});


