const axios = require("axios");
const { ethers } = require("ethers");
const MyNFT = require("../nft-marketplace-frontend/contractsData/MyNFT.json");
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
const endpointERC721 =
  "https://api.studio.thegraph.com/query/43717/sepoliaeip721/version/latest";
const endpointartlley =
  "https://api.studio.thegraph.com/query/43717/artalley/version/latest";
const headers = {
  "content-type": "application/json",
};
const provider = new ethers.JsonRpcProvider(
  "https://eth-sepolia.g.alchemy.com/v2/VMfx3k7jHQ6YPZp_BDK9JFJpwXjRrDVc"
);
async function fetchsearch(nameofcollection) {
  const collectionSearch = {
    query: `{
        erc721Contracts(where: {name_contains_nocase: "${nameofcollection}"}) {
          id
          name
          symbol
        }
      }`,
  };

  const searchedcollections = await axios({
    url: endpointERC721,
    method: "post",
    headers: headers,
    data: collectionSearch,
  });
  return new Promise(async (resolve, reject) => {
    const newlist = [];
    await Promise.all(
      searchedcollections.data.data.erc721Contracts.map(
        async (collection, index) => {
          let collectiondata = await checkforcollectiondata(collection);
          newlist.push(collectiondata);
        }
      )
    );

    resolve(newlist);
  });
}
async function checkforcollectiondata(collection) {
  const collectionAddress = collection.id;
  const contract = new ethers.Contract(collectionAddress, MyNFT.abi, provider);

  const nameOfCollection = collection.name;
  let metadataOfCollection;
  let totalSupplyOfCollectionbignumber;
  let cont = true;
  while (cont) {
    try {
      totalSupplyOfCollectionbignumber = await contract.totalSupply();
      if (totalSupplyOfCollectionbignumber) {
        cont = false;
      }
    } catch (e) {
      if (e.info.error.code == 429) {
        cont = true;

        sleep(100);

        // sleep(1000);
      } else {
        cont = false;
      }
      console.log(e);
    }
  }
  // console.log(e);

  if (!totalSupplyOfCollectionbignumber) {
    delete contract;
    return {};
  } else {
    try {
      metadataOfCollection = await contract.contractURI();
    } catch (e) {
      if (e.code) console.log(e);
    }

    let totalSupplyOfCollection = totalSupplyOfCollectionbignumber.toString();

    // console.log("await completed");
    ///revert ! not cndition

    if (metadataOfCollection) {
      let metadata = {};
      var requestOptions = {
        method: "GET",
        redirect: "follow",
      };
      // console.log(metadataOfCollection);/
      try {
        let response = await fetch(metadataOfCollection, requestOptions);
        metadata = await response.json();
        let collectiondata = {
          name: nameOfCollection,
          collectionAddress,

          totalSupplyOfCollection,

          metadata: metadata,
        };
        delete contract;
        // console.log("metadata fetched", collectiondata);
        return collectiondata;
        // console.log(result);
      } catch (error) {}
      //
      // console.log("metadata fetched", metadata);
    } else {
      const dummydata = {
        collectionAddress,
        name: "OpenSea Creatures",
        description:
          "OpenSea Creatures are adorable aquatic beings primarily for demonstrating what can be done using the OpenSea platform. Adopt one today to try out all the OpenSea buying, selling, and bidding feature set.",
        image: "https://placeimg.com/640/480/any",
        external_link: "external-link-url",
      };

      let collectiondata = {
        name: nameOfCollection,
        collectionAddress,

        totalSupplyOfCollection,

        metadata: dummydata,
      };
      delete contract;

      return collectiondata;
    }
  }
}

async function getFloorPrice(collectionAddress) {
  // console.log(collectionAddress);
  if (!collectionAddress) return;
  const query = {
    query: `{
      
            listings(orderBy :listingPrice orderDirection: asc where: { collectionAddress: "${collectionAddress}"}) {
              listingPrice
            }}`,
  };

  const response = await axios({
    url: endpointartlley,
    method: "post",
    headers: headers,
    data: query,
  });

  // console.log(response.data.data.listings[0].listingPrice);
  let floorprice;
  let totalvolume = 0;
  if (!response.data.data.listings[0]) {
    floorprice = 0;
    totalvolume = 0;
    return { floorprice, totalvolume };
  }
  floorprice = response.data.data.listings[0].listingPrice.toString();
  let listings = response.data.data.listings;

  listings.map((listing) => {
    totalvolume += parseInt(listing.listingPrice);
  });

  return { floorprice, totalvolume };
}

module.exports = { fetchsearch };
