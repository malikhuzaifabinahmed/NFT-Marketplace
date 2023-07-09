"use server";

const axios = require("axios");
import { ethers } from "ethers";
import MyNFT from "contractsData/MyNFT.json";
import { resolve } from "path";
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

        let listings = await extractTopCollectionList(
            response.data.data.listings
        );
        let listingdata = [];

        Promise.all(
            listings.map(async (listing) => {
                // resolve(listing);
                listingdata.push(await checkforcollectiondata(listing.address));
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
    const contract = new ethers.Contract(
        collectionAddress,
        MyNFT.abi,
        provider
    );
    const metadataOfCollection = await contract.contractURI();
    ///revert ! not cndition

    if (!metadataOfCollection) {
        return new Promise(async (resolve, reject) => {
            fetch(uri(metadataOfCollection)).then((res) => {
                return res;
            });
        });
    } else {
        const dummydata = {
            collectionAddress,
            name: "OpenSea Creatures",
            description:
                "OpenSea Creatures are adorable aquatic beings primarily for demonstrating what can be done using the OpenSea platform. Adopt one today to try out all the OpenSea buying, selling, and bidding feature set.",
            image: "https://placeimg.com/640/480/any",
            external_link: "external-link-url",
        };
        return dummydata;
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
module.exports = fetchtopcollections;
