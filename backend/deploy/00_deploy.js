const {} = require("hardhat");
module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  await deploy("CollectionFactory", {
    from: deployer,
    args: [],
    log: true,
  });
};
module.exports.tags = ["Cf"];
