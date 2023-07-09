const { ethers } = require("ethers");

const provider = new ethers.JsonRpcProvider(
  "https://eth-sepolia.g.alchemy.com/v2/VMfx3k7jHQ6YPZp_BDK9JFJpwXjRrDVc"
);

provider.getBlockNumber().then((blockNumber) => {
  console.log(blockNumber);
  provider.getBlock(blockNumber).then((block) => {
    console.log(block);
  });
});
