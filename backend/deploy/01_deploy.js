const {} = require("hardhat");
const fs = require("fs");
module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const marketplace = await deploy("ArtAlleyMarketplace", {
    from: deployer,
    args: [],
    log: true,
  });
  saveFrontendFiles(marketplace, "ArtAlleyMarketplace");
};
module.exports.tags = ["all", "MP"];

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
