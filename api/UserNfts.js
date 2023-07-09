const axios = require("axios");
const ethers = require("ethers");
const provider = new ethers.JsonRpcProvider(
  "https://eth-sepolia.g.alchemy.com/v2/VMfx3k7jHQ6YPZp_BDK9JFJpwXjRrDVc"
);
async function fetchAllUserData(userId) {
  const endpointERC721 =
    "https://api.studio.thegraph.com/query/43717/sepoliaeip721/version/latest";
  const endpointartlley =
    "https://api.studio.thegraph.com/query/43717/artalley/version/latest";
  const allNftsQuery = {
    query: `{
            account(id: "${userId}") {
                  ERC721tokens(first:100) {
                    identifier
                    uri
                    contract {
                      id
                      name
                      symbol
                      supportsMetadata
                    }
                    
                  }
                }
              }`,
  };

  const onSaleQuery = {
    query: `{
             listings(
                  where: {owner: "${userId}", approval: true}
                ) {
                  tokenId
                  listingPrice
                  owner
                  collectionAddress
                }
              }`,
  };

  const notListedQuery = {
    query: `{
            account(id: "${userId}") {
              ERC721tokens(where: {approval: "0x0000000000000000000000000000000000000000"}) {
                identifier
                uri
                contract {
                  id
                  name
                  symbol
                  supportsMetadata
                }
                
              }
            }
          }`,
  };

  const offercreatedQuery = {
    query: `{
            offers(
              where: {offerer: "${userId}", valid: true}
            ) {
              offerer
              owner
              collectionAddress
              price
              tokenId
              valid
              endTime
            }
          }`,
  };

  const offerReceivedQuery = {
    query: `{
            offers(
              where: {owner: "${userId}", valid: true}
            ) {
              offerer
              owner
              collectionAddress
              price
              tokenId
              valid
              endTime
            }
          }`,
  };

  const headers = {
    "content-type": "application/json",
  };
  return new Promise(async (resolve, reject) => {
    // resolve(userId);

    const allNfts = await axios({
      url: endpointERC721,
      method: "post",
      headers: headers,
      data: allNftsQuery,
    });

    const onSale = await axios({
      url: endpointartlley,
      method: "post",
      headers: headers,
      data: onSaleQuery,
    });
    const notListed = await axios({
      url: endpointERC721,
      method: "post",
      headers: headers,
      data: notListedQuery,
    });
    const offerCreated = await axios({
      url: endpointartlley,
      method: "post",
      headers: headers,
      data: offercreatedQuery,
    });
    const offerReceived = await axios({
      url: endpointartlley,
      method: "post",
      headers: headers,
      data: offerReceivedQuery,
    });
    const newAllNfts = await preProcessNonlisteddata(
      allNfts.data.data.account.ERC721tokens
    );
    // resolve({
    //   onSale: onSale.data.data.listings,
    //   notListed: notListed.data,
    //   offerCreated: offerCreated.data.data.offers,
    //   offerReceived: offerReceived.data.data.offers,
    // });
    // resolve(newAllNfts);
    let userdata = {};
    if (!userdata.onSale) {
      userdata.onSale = [];
    }
    if (!userdata.notListed) {
      userdata.notListed = [];
    }
    if (!userdata.offerCreated) {
      userdata.offerCreated = [];
    }
    if (!userdata.offerReceived) {
      userdata.offerReceived = [];
    }
    newAllNfts.map((token) => {
      let onSalein = onSale.data.data.listings.find((tokenin) => {
        return (
          tokenin.tokenId == token.tokenId &&
          tokenin.collectionAddress == token.contractAddress
        );
      });

      // let offerReceivedin = offerReceived.data.data.offers.find((tokenin) => {
      //   return (
      //     tokenin.tokenId == token.tokenId &&
      //     tokenin.collectionAddress == token.contractAddress
      //   );
      // });
      // let offerCreatedin = offerCreated.data.data.offers.find((tokenin) => {
      //   return (
      //     tokenin.tokenId == token.tokenId &&
      //     tokenin.collectionAddress == token.contractAddress
      //   );
      // });

      if (onSalein) {
        let data = {
          tokenId: token.tokenId,
          contractAddress: onSalein.collectionAddress,
          price: onSalein.listingPrice,
          tokenData: token.tokenData,
        };

        userdata.onSale.push(data);
      } else {
        let data = {
          tokenId: token.tokenId,
          contractAddress: token.contractAddress,

          tokenData: token.tokenData,
        };
        userdata.notListed.push(data);
      }

      // if (offerCreatedin) {
      //   let data = {
      //     tokenId: token.tokenId,
      //     contractAddress: token.contractAddress,

      //     offerer: offerCreatedin.offerer,
      //     price: offerCreatedin.price,
      //     endtime: offerCreatedin.endtime - block.timestamp,
      //     tokenData: token.tokenData,
      //   };
      //   userdata.offerCreated.push(data);
      // }
      // if (offerReceivedin) {
      //   let data = {
      //     tokenId: token.tokenId,
      //     contractAddress: token.contractAddress,

      //     offerer: offerReceivedin.offerer,
      //     price: offerReceivedin.price,
      //     endtime: offerReceivedin.endTime - block.timestamp,
      //     tokenData: token.tokenData,
      //   };
      //   userdata.offerReceived.push(data);
      // }
    });
    Promise.all(
      offerCreated.data.data.offers.map(async (offer) => {
        userdata.offerCreated.push(await preProcesOfferData(offer));
      })
    ).then(() => {
      Promise.all(
        offerReceived.data.data.offers.map(async (offer) => {
          userdata.offerReceived.push(await preProcesOfferData(offer));
        })
      ).then(() => {
        resolve(userdata);
      });
    });

    // resolve(allNfts1);
  });
}
async function preProcesOfferData(offer) {
  const blockNumber = await provider.getBlockNumber();
  const block = await provider.getBlock(blockNumber);
  const endpointERC721 =
    "https://api.studio.thegraph.com/query/43717/sepoliaeip721/version/latest";
  const headers = {
    "content-type": "application/json",
  };
  const query = {
    query: `{
    erc721Token(id: "${offer.collectionAddress}/0x${offer.tokenId}") {
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
  const offerdata = await axios({
    url: endpointERC721,
    method: "post",
    headers: headers,
    data: query,
  });
  var requestOptions = {
    method: "GET",
    redirect: "follow",
    responseType: "json",
  };
  let response = await axios.get(
    offerdata.data.data.erc721Token.uri,
    requestOptions
  );
  if (response.data) {
    return {
      tokenId: offer.tokenId,
      contractAddress: offer.collectionAddress,
      collectionName: offerdata.data.data.erc721Token.contract.name,
      offerer: offer.offerer,
      price: offer.price,
      endtime: offer.endTime - block.timestamp,
      tokenData: response.data,
    };
  } else {
    return {};
  }
}

async function preProcessNonlisteddata(nonListed) {
  var requestOptions = {
    method: "GET",
    redirect: "follow",
    responseType: "json",
  };
  let newlist = [];
  await Promise.all(
    nonListed.map(async (nft) => {
      try {
        let response = await axios.get(nft.uri, requestOptions);

        if (response.data) {
          // console.log(nft);

          newlist.push({
            tokenId: nft.identifier,
            contractAddress: nft.contract.id,
            tokenData: response.data,
          });
        } else {
          return {};
        }
      } catch (error) {}
    })
  );
  return newlist;
  //   console.log(data);
}

async function checkData(tokenId, collectionAddress, userId, user) {
  const endpointERC721 =
    "https://api.studio.thegraph.com/query/43717/sepoliaeip721/version/latest";

  const headers = {
    "content-type": "application/json",
  };
  const query = {
    query: `{
      erc721Contract(id: "${collectionAddress}") {
        tokens(where: {identifier: "${tokenId}"}) {
          uri
          identifier
          owner {
            id
          }
        }

        name
        symbol
      }
    }`,
  };

  const data = await axios({
    url: endpointERC721,
    method: "post",
    headers: headers,
    data: query,
  });

  // return data.data;
  let erc721Contract = data.data.data.erc721Contract;
  // return erc721Contract;
  if (erc721Contract.tokens.length > 0) {
    let isOwner = false;
    let ownerData = {};
    console.log(erc721Contract.tokens[0].owner.id);
    console.log(userId);
    if (erc721Contract.tokens[0].owner.id === userId) {
      isOwner = true;
      if (user != {}) ownerData = user;
    }

    return {
      isOwner,
      collectionName: erc721Contract.name,
      collectionSymbol: erc721Contract.symbol,
      owner: erc721Contract.tokens[0].owner.id,
      ownerData,
    };
  }
}

module.exports = {
  fetchAllUserData,
  checkData,
};
