const {} = require("hardhat");
module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const collectionfatory = await deploy("CollectionFactory", {
    from: deployer,
    args: [],
    log: true,
  });
  saveFrontendFiles(collectionfatory, "CollectionFactory");
};
module.exports.tags = ["all", "Cf"];
function saveFrontendFiles(contract, name) {
  const fs = require("fs");
  const contractsDir =
    __dirname + "/../../nft-marketplace-frontend/contractsData";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + `/${name}-address.json`,
    JSON.stringify({ address: contract.address }, undefined, 2)
  );

  const contractArtifact = artifacts.readArtifactSync(name);

  fs.writeFileSync(
    contractsDir + `/${name}.json`,
    JSON.stringify(contractArtifact, null, 2)
  );
}
