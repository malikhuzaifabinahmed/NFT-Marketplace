const axios = require("axios");
const { ethers } = require("ethers");
const MyNFT = require("../nft-marketplace-frontend/contractsData/MyNFT.json");
const { resolve } = require("path");

const endpoint =
  "https://api.studio.thegraph.com/query/43717/artalley/version/latest";

const headers = {
  "content-type": "application/json",
};
function fetchtopcollections() {
  const graphqlQuery = {
    query: `query onsale {
        listings(orderBy: eventcount, orderDirection: desc, where: {approval:true   }) {
          updatedAt
          tokenId
          owner
          listingPrice
          id
          createdAt
          collectionAddress
          approval
          eventcount
        }
      }`,
  };

  return new Promise(async (resolve, reject) => {
    const response = await axios({
      url: endpoint,
      method: "post",
      headers: headers,
      data: graphqlQuery,
    });
    // resolve(response.data.data.listings);
    let listings = await extractTopCollectionList(response.data.data.listings);

    let listingdata = [];

    Promise.all(
      listings.map(async (listing) => {
        // resolve(listing);
        let collectiondata = await checkforcollectiondata(listing.address);
        // resolve(collectiondata);
        listingdata.push(collectiondata);
      })
    )
      .then(() => {
        resolve(listingdata);
      })
      .catch((error) => {
        reject(error);
      });

    // resolve(listingdata);
    // resolve(response.data.data.listings);
  });
}

async function checkforcollectiondata(collectionAddress) {
  const provider = new ethers.JsonRpcProvider(
    "https://eth-sepolia.g.alchemy.com/v2/VMfx3k7jHQ6YPZp_BDK9JFJpwXjRrDVc"
  );
  const contract = new ethers.Contract(collectionAddress, MyNFT.abi, provider);
  const metadataOfCollection = await contract.contractURI();
  const nameOfCollection = await contract.name();
  const totalSupplyOfCollectionbignumber = await contract.totalSupply();
  const { floorprice, totalvolume } = await getFloorPrice(collectionAddress);
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

        floorprice,
        totalvolume,
        metadata: metadata,
      };
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

    collectiondata = {
      name: nameOfCollection,
      collectionAddress,

      totalSupplyOfCollection,
      floorprice,
      totalvolume,
      metadata: dummydata,
    };

    return collectiondata;
  }
}

function extractTopCollectionList(listings) {
  let countMap = {};
  for (let i in listings) {
    const obj = listings[i];
    let collectionAddress = obj.collectionAddress;
    countMap[`${collectionAddress}`] =
      (countMap[`${collectionAddress}`] || 0) + 1;
  }
  const countArray = Object.entries(countMap).map(([address, count]) => ({
    address,
    count,
  }));

  countArray.sort((a, b) => b.count - a.count);
  return countArray;
}

async function getFloorPrice(collectionAddress) {
  // console.log(collectionAddress);
  const query = {
    query: `{
    
          listings(orderBy :listingPrice orderDirection: asc where: { collectionAddress: "${collectionAddress}"}) {
            listingPrice
          }}`,
  };

  const response = await axios({
    url: endpoint,
    method: "post",
    headers: headers,
    data: query,
  });

  // console.log(response.data.data.listings[0].listingPrice);
  let floorprice = response.data.data.listings[0].listingPrice.toString();
  let listings = response.data.data.listings;
  let totalvolume = 0;
  listings.map((listing) => {
    totalvolume += parseInt(listing.listingPrice);
  });

  return { floorprice, totalvolume };
}

module.exports = {
  fetchtopcollections: fetchtopcollections,
};
