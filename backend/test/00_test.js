const { assert } = require("chai");
const { deployments, getNamedAccounts, ethers } = require("hardhat");

describe("Test collectionFactory", () => {
  let collectionFactory;
  let deployer;
  beforeEach(async () => {
    deployer = (await getNamedAccounts()).deployer;
    await deployments.fixture(["Cf"]);
    collectionFactory = await ethers.getContract(["CollectionFactory"]);
  });
  it("Testing Creating nft function is assigning name symbol and owner address ", async () => {
    const name = "newNftContract";
    const symbol = "MYnft";
    await collectionFactory.createCollection(name, symbol);
    const currentcollectionobject = await collectionFactory.getCollection(0);

    assert.equal(name, currentcollectionobject[1]);
    assert.equal(symbol, currentcollectionobject[2]);
    assert.equal(deployer, currentcollectionobject[3]);
  });

  it("testing getCollectionByOwner function", async () => {
    const name = "newNftContract";
    const symbol = "MYnft";
    await collectionFactory.createCollection(name, symbol);
    const currentowner = await collectionFactory.getCollectionsByOwner(
      deployer
    );
    const assertedvalue = await collectionFactory.getCollection(0);
    assert.equal(currentowner[0], assertedvalue[0]);
  });
});
