const axios = require("axios");

// Fetches NFTs of a collection
function fetchNftOfCollection(collectionAddress) {
  const endpoint =
    "https://api.studio.thegraph.com/query/43717/sepoliaeip721/version/latest";
  const endpointartlley =
    "https://api.studio.thegraph.com/query/43717/artalley/version/latest";
  const headers = {
    "content-type": "application/json",
  };
  const collectionTokenquery = {
    query: `{
            account(id : "${collectionAddress}") {
              asERC721 {
                id
                symbol
                name   
                tokens(orderBy: identifier, orderDirection: asc) {
                  uri
                  identifier
                }
              }
            }
          }`,
  };
  // console.log(collectionAddress);
  const listingprices = {
    query: `{
    listings(where: {collectionAddress: "${collectionAddress}" approval: true}) {
      tokenId
      listingPrice
    }
  }`,
  };
  return new Promise(async (resolve, reject) => {
    const response = await axios({
      url: endpoint,
      method: "post",
      headers: headers,
      data: collectionTokenquery,
    });

    const listingprice = await axios({
      url: endpointartlley,
      method: "post",
      headers: headers,
      data: listingprices,
    });
    // resolve(listingprice.data);
    const newtokkendata = {};

    await Promise.all(
      response.data.data.account.asERC721.tokens.map(async (token) => {
        let tokenURI = token.uri;
        let tokenId = token.identifier;
        let tokenData = await axios.get(tokenURI);

        let price = listingprice.data.data.listings.find((token) => {
          return token.tokenId == tokenId;
        });

        if (!price) {
          if (!newtokkendata["notListed"]) {
            newtokkendata["notListed"] = [];
          }

          newtokkendata["notListed"].push({
            tokenId,
            tokenData: tokenData.data,
          });
        } else {
          if (!newtokkendata["listed"]) {
            newtokkendata["listed"] = [];
          }
          newtokkendata["listed"].push({
            tokenId,
            price: price.listingPrice,
            tokenData: tokenData.data,
          });
        }
        // resolve({ listed, notListed });
      })
    );

    // .then((listed, notListed) => {
    resolve(newtokkendata);
    // });
  });
}
function fetchTopNFTs() {
  const endpoint =
    "https://api.studio.thegraph.com/query/43717/sepoliaeip721/version/latest";
  const endpointartlley =
    "https://api.studio.thegraph.com/query/43717/artalley/version/latest";
  const headers = {
    "content-type": "application/json",
  };

  // console.log(collectionAddress);
  const listingsquery = {
    query: `{
      listings(orderBy: eventcount, orderDirection: desc  where: { approval: true}) {
        approval
        listingPrice
        owner
        tokenId
        updatedAt
        eventcount
        createdAt
        collectionAddress
      }
    }`,
  };
  return new Promise(async (resolve, reject) => {
    const listings = await axios({
      url: endpointartlley,
      method: "post",
      headers: headers,
      data: listingsquery,
    });

    let newtokkendata;
    Promise.all(
      listings.data.data.listings.map(async (token) => {
        const tokenquery = {
          query: `{
        erc721Token(id: "${token.collectionAddress}/0x${token.tokenId}") {
          id
          identifier
          uri
          contract {
            id
            name
            symbol
            supportsMetadata
          }
        }
      }`,
        };
        var requestOptions = {
          method: "GET",
          redirect: "follow",
          responseType: "json",
        };
        const tokendata = await axios({
          url: endpoint,
          method: "post",
          headers: headers,
          data: tokenquery,
        });
        let tokenId = token.tokenId;

        let response = await axios.get(
          tokendata.data.data.erc721Token.uri,
          requestOptions
        );
        if (response.data) {
          return {
            tokenId,
            price: token.listingPrice,
            owner: token.owner,
            eventCount: token.eventcount,
            contractAddress: token.collectionAddress,
            tokenData: response.data,
          };
        } else {
          return {};
        }
      })
    ).then((res) => {
      resolve(res);
    });
  });
}

module.exports = { fetchNftOfCollection, fetchTopNFTs };
