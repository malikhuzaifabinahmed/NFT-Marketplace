const Moralis = require("moralis");

async function getContractData(address) {
  try {
    await Moralis.start({
      apiKey:
        "162PobAXoHDe3JLg8OJn406fZpZxKr11wx9ixOl2MzJZntwxq99CN9i8d2PQJLZk",
    });

    const response = await Moralis.EvmApi.nft.getNFTOwners({
      chain: "0xaa36a7",
      format: "decimal",
      mediaItems: false,
      address: address,
    });
    return response.raw;
    //   console.log(response.raw);
  } catch (e) {
    console.error(e);
  }
}

module.exports = { getContractData };
