import React from "react";

import { ethers } from "ethers";
import { useState } from "react";
//Internal import
import Style from "./DetailsPage.module.css";
import marketplaceAbi from "../contractsData/ArtAlleyMarketplace.json";
import marketplaceAddress from "../contractsData/ArtAlleyMarketplace-address.json";
import collectionAbi from "../contractsData/MyNFT.json";
import { web3Handler } from "@/Utilities/walletdataprovider";
import CountdownComponent from "@/components/countdown/countDown";
import e from "cors";
const DetailsPage = ({
    tokenId,
    collectionAddress,
    nftData,
    from,
    retlatedData,
}) => {
    const [price, setPrice] = useState("0");
    const [updateClicked, setUpdateClicked] = useState(false);
    const [offerTime, setOfferTime] = useState("86400");
    function weiToEth(wei) {
        const ether = ethers.formatEther(wei);
        return ether;
    }
    if (price === "") {
        setPrice("0");
    }
    const handleBuy = async () => {
        web3Handler()
            .then(async ({ signer, provider }) => {
                const marketPlaceContract = new ethers.Contract(
                    marketplaceAddress.address,
                    marketplaceAbi.abi,
                    signer
                );

                marketPlaceContract
                    .buyListing(
                        collectionAddress,
                        tokenId,

                        { value: nftData.price }
                    )
                    .then(async (transaction) => {
                        await transaction.wait();
                    })
                    .catch((e) => {
                        console.log(e);
                    });
            })
            .catch((e) => {
                console.log(e);
            });
    };
    console.log(offerTime);
    const handleOffer = async () => {
        web3Handler()
            .then(async ({ signer, provider }) => {
                const marketPlaceContract = new ethers.Contract(
                    marketplaceAddress.address,
                    marketplaceAbi.abi,
                    signer
                );

                marketPlaceContract
                    .createOffer(
                        collectionAddress,
                        tokenId,
                        ethers.parseEther(price),
                        String(Number(offerTime) * 86400 + 1),
                        { value: ethers.parseEther(price) }
                    )
                    .then(async (transaction) => {
                        await transaction.wait();
                    })
                    .catch((e) => {
                        console.log(e);
                    });
            })
            .catch((e) => {
                console.log(e);
            });
    };
    const handleUpdataListing = async () => {
        web3Handler().then(async ({ signer, provider }) => {
            const marketPlaceContract = new ethers.Contract(
                marketplaceAddress.address,
                marketplaceAbi.abi,
                signer
            );
            const collectionContract = new ethers.Contract(
                collectionAddress,
                collectionAbi.abi,
                signer
            );

            const collectionContractprovider = new ethers.Contract(
                collectionAddress,
                collectionAbi.abi,
                provider
            );
            try {
                collectionContractprovider
                    .isApprovedForAll(
                        retlatedData.owner,
                        marketplaceAddress.address
                    )
                    .then(async (res) => {
                        if (res) {
                            const transaction =
                                await marketPlaceContract.updateListing(
                                    collectionAddress,
                                    tokenId,
                                    ethers.parseEther(price)
                                );

                            await transaction.wait();
                        } else {
                            try {
                                collectionContract
                                    .setApprovalForAll(
                                        marketplaceAddress.address,
                                        true
                                    )
                                    .then(async () => {
                                        marketPlaceContract
                                            .createListing(
                                                collectionAddress,
                                                tokenId,
                                                ethers.parseEther(price)
                                            )
                                            .then(async (transaction) => {
                                                await transaction.wait();
                                            })
                                            .catch((e) => {
                                                console.log(e);
                                            });
                                    })
                                    .catch((e) => console.log(e));
                            } catch (e) {}
                        }
                    });
            } catch (e) {
                console.log(e);
            }
        });
    };
    const handleCancleListing = async () => {
        web3Handler()
            .then(async ({ signer, provider }) => {
                const marketPlaceContract = new ethers.Contract(
                    marketplaceAddress.address,
                    marketplaceAbi.abi,
                    signer
                );

                marketPlaceContract
                    .cancleListing(collectionAddress, tokenId)
                    .then(async (transaction) => {
                        await transaction.wait();
                    })
                    .catch((e) => {
                        console.log(e);
                    });
            })
            .catch((e) => console.log(e));
    };

    const handleListitems = async () => {
        web3Handler().then(async ({ signer, provider }) => {
            const marketPlaceContract = new ethers.Contract(
                marketplaceAddress.address,
                marketplaceAbi.abi,
                signer
            );
            const collectionContract = new ethers.Contract(
                collectionAddress,
                collectionAbi.abi,
                signer
            );

            const collectionContractprovider = new ethers.Contract(
                collectionAddress,
                collectionAbi.abi,
                provider
            );
            try {
                collectionContractprovider
                    .isApprovedForAll(
                        retlatedData.owner,
                        marketplaceAddress.address
                    )
                    .then(async (res) => {
                        if (res) {
                            const transaction =
                                await marketPlaceContract.createListing(
                                    collectionAddress,
                                    tokenId,
                                    ethers.parseEther(price)
                                );

                            await transaction.wait();
                        } else {
                            try {
                                collectionContract
                                    .setApprovalForAll(
                                        marketplaceAddress.address,
                                        true
                                    )
                                    .then(async () => {
                                        marketPlaceContract
                                            .createListing(
                                                collectionAddress,
                                                tokenId,
                                                ethers.parseEther(price)
                                            )
                                            .then(async (transaction) => {
                                                await transaction.wait();
                                            })
                                            .catch((e) => console.log(e));
                                    })
                                    .catch((e) => console.log(e));
                            } catch (e) {}
                        }
                    });
            } catch (e) {
                console.log(e);
            }
        });
    };
    const handleCancleOffer = async () => {
        web3Handler().then(async ({ signer, provider }) => {
            const marketPlaceContract = new ethers.Contract(
                marketplaceAddress.address,
                marketplaceAbi.abi,
                signer
            );

            marketPlaceContract
                .cancleOffer(collectionAddress, tokenId)
                .then(async (transaction) => {
                    await transaction.wait();
                })
                .catch((e) => {
                    console.log(e);
                });
        });
    };
    const handleAcceptOffer = async () => {
        web3Handler()
            .then(async ({ signer, provider }) => {
                const marketPlaceContract = new ethers.Contract(
                    marketplaceAddress.address,
                    marketplaceAbi.abi,
                    signer
                );

                marketPlaceContract
                    .acceptOffer(nftData.offerer, collectionAddress, tokenId)
                    .then(async (transaction) => {
                        await transaction.wait();
                    })
                    .catch((e) => {
                        console.log(e);
                    });
            })
            .catch((e) => {
                console.log(e);
            });
    };
    const handleDeclineOffer = async () => {
        web3Handler().then(async ({ signer, provider }) => {
            const marketPlaceContract = new ethers.Contract(
                marketplaceAddress.address,
                marketplaceAbi.abi,
                signer
            );

            marketPlaceContract
                .declineOffer(nftData.offerer, collectionAddress, tokenId)
                .then(async (transaction) => {
                    await transaction.wait();
                })
                .catch((e) => {
                    console.log(e);
                });

            await transaction.wait();
        });
    };
    const handleUpdateOffer = async () => {
        web3Handler()
            .then(async ({ signer, provider }) => {
                const marketPlaceContract = new ethers.Contract(
                    marketplaceAddress.address,
                    marketplaceAbi.abi,
                    signer
                );

                marketPlaceContract
                    .updateOffer(
                        collectionAddress,
                        tokenId,
                        ethers.parseEther(price),
                        String(Number(offerTime) * 86400 + 1),
                        { value: ethers.parseEther(price) }
                    )
                    .then(async (transaction) => {
                        await transaction.wait();
                    })
                    .catch((e) => {
                        console.log(e);
                    });
            })
            .catch((e) => {
                console.log(e);
            });
    };

    if (from == "profileOfferCreated" || from == "profileOfferReceived") {
        return (
            <div className={Style.container}>
                <div className={Style.leftContainer}>
                    <div className={Style.collectionName}>
                        <h2>{retlatedData.collectionName}</h2>
                    </div>
                    <div className={Style.NFTName}>
                        <h3>{nftData.tokenData.name}</h3>
                    </div>
                    <div className={Style.creatorName}>
                        <p>
                            {retlatedData.ownerData.name
                                ? retlatedData.ownerData.name
                                : retlatedData.owner}
                        </p>
                    </div>
                    <div className={Style.NFTImage}>
                        <img
                            src={nftData.tokenData.image}
                            width="200"
                            height="200"
                        />
                    </div>

                    <div className={Style.NFTDescription}>
                        <p>{nftData.tokenData.description}</p>
                    </div>
                    <div className={Style.collectionDescription}>
                        <p></p>
                    </div>
                </div>

                <div className={Style.rightContainer}>
                    <div className={Style.rightContainerInner}>
                        <div className={Style.tokenDetails}>
                            <div className={Style.tokenDetail}>
                                <p>Token ID:</p>
                                <p>{tokenId}</p>
                            </div>
                            <div className={Style.tokenDetail}>
                                <p>Contract Address:</p>

                                <p>{collectionAddress}</p>
                            </div>
                            <div className={Style.tokenDetail}>
                                <p>Token Standard:</p>
                                <p>ERC-721</p>
                            </div>
                            <div className={Style.tokenDetail}>
                                <p>Blockchain:</p>
                                <p>Ethereum</p>
                            </div>
                            <div className={Style.priceDetails}>
                                {nftData.price ? (
                                    <div className={Style.priceDetail}>
                                        <p>Offered Price:</p>
                                        <p>{weiToEth(nftData.price)} ETH</p>
                                    </div>
                                ) : (
                                    ""
                                )}
                            </div>
                            {from === "profileOfferCreated" ? (
                                updateClicked ? (
                                    <div>
                                        <p className={Style.tokenDetail}>
                                            Enter Price in ETH
                                        </p>
                                        <input
                                            type="number"
                                            className={Style.inputbox}
                                            placeholder="Enter Price"
                                            onChange={(e) => {
                                                setPrice(e.target.value);
                                            }}
                                        />
                                        <input
                                            type="number"
                                            className={Style.inputbox}
                                            placeholder="Enter Duration in Days"
                                            onChange={(e) => {
                                                setOfferTime(e.target.value);
                                            }}
                                        />
                                        <button
                                            className={Style.offerButton}
                                            type="submit"
                                            onClick={handleUpdateOffer}>
                                            Update Offer
                                        </button>
                                        <button
                                            className={Style.offerButton}
                                            type="submit"
                                            onClick={handleCancleOffer}>
                                            Cancel Offer
                                        </button>
                                    </div>
                                ) : (
                                    <div>
                                        {" "}
                                        <button
                                            className={Style.offerButton}
                                            type="submit"
                                            onClick={(e) => {
                                                setUpdateClicked(true);
                                            }}>
                                            Update Offer
                                        </button>
                                        <button
                                            className={Style.offerButton}
                                            type="submit"
                                            onClick={handleCancleOffer}>
                                            Cancel Offer
                                        </button>
                                    </div>
                                )
                            ) : (
                                ""
                            )}
                            {from === "profileOfferReceived" ? (
                                <div>
                                    <p className={Style.tokenDetail}>
                                        Enter Price in ETH
                                    </p>
                                    <input
                                        type="number"
                                        className={Style.inputbox}
                                        placeholder="Enter Price"
                                        onChange={(e) => {
                                            setPrice(e.target.value);
                                        }}
                                    />
                                    <button
                                        className={Style.offerButton}
                                        type="submit"
                                        onClick={handleAcceptOffer}>
                                        Accept Offer
                                    </button>
                                    <button
                                        className={Style.offerButton}
                                        type="submit"
                                        onClick={handleDeclineOffer}>
                                        Decline Offer
                                    </button>
                                </div>
                            ) : (
                                ""
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    } else {
        return (
            <div className={Style.container}>
                <div className={Style.leftContainer}>
                    <div className={Style.collectionName}>
                        <h2>{retlatedData.collectionName}</h2>
                    </div>
                    <div className={Style.NFTName}>
                        <h3>{nftData.tokenData.name}</h3>
                    </div>
                    <div className={Style.creatorName}>
                        <p>
                            {retlatedData.ownerData.name
                                ? retlatedData.ownerData.name
                                : retlatedData.owner}
                        </p>
                    </div>
                    <div className={Style.NFTImage}>
                        <img
                            src={nftData.tokenData.image}
                            width="200"
                            height="200"
                        />
                    </div>

                    <div className={Style.NFTDescription}>
                        <p>{nftData.tokenData.description}</p>
                    </div>
                    <div className={Style.collectionDescription}>
                        <p></p>
                    </div>
                </div>

                <div className={Style.rightContainer}>
                    <div className={Style.rightContainerInner}>
                        <div className={Style.tokenDetails}>
                            <div className={Style.tokenDetail}>
                                <p>Token ID:</p>
                                <p>{tokenId}</p>
                            </div>
                            <div className={Style.tokenDetail}>
                                <p>Contract Address:</p>

                                <p>{collectionAddress}</p>
                            </div>
                            <div className={Style.tokenDetail}>
                                <p>Token Standard:</p>
                                <p>ERC-721</p>
                            </div>
                            <div className={Style.tokenDetail}>
                                <p>Blockchain:</p>
                                <p>Ethereum</p>
                            </div>
                        </div>
                        <div className={Style.priceDetails}>
                            {nftData.price ? (
                                <div className={Style.priceDetail}>
                                    <p>Current Price:</p>
                                    <p>{weiToEth(nftData.price)} ETH</p>
                                </div>
                            ) : (
                                ""
                            )}
                        </div>
                        {from === "collectionNotListed" ? (
                            retlatedData.isOwner ? (
                                <div>
                                    <p className={Style.tokenDetail}>
                                        Enter Price in ETH
                                    </p>
                                    <input
                                        type="number"
                                        className={Style.inputbox}
                                        placeholder="Enter Price"
                                        onChange={(e) => {
                                            setPrice(e.target.value);
                                        }}
                                    />
                                    <button
                                        className={Style.offerButton}
                                        type="submit"
                                        onClick={handleListitems}>
                                        List Item
                                    </button>
                                </div>
                            ) : (
                                <div>
                                    {" "}
                                    <input
                                        type="number"
                                        className={Style.inputbox}
                                        placeholder="Enter Price"
                                        style={{ margin: "0 0 20px 0" }}
                                        onChange={(e) => {
                                            setPrice(e.target.value);
                                        }}
                                    />
                                    <input
                                        type="number"
                                        className={Style.inputbox}
                                        placeholder="Enter Duration in Days"
                                        onChange={(e) => {
                                            setOfferTime(e.target.value);
                                        }}
                                    />
                                    <button
                                        className={Style.offerButton}
                                        type="submit"
                                        onClick={handleOffer}>
                                        Make Offer
                                    </button>
                                </div>
                            )
                        ) : (
                            ""
                        )}

                        {from === "collectionListed" ? (
                            retlatedData.isOwner ? (
                                updateClicked ? (
                                    <div>
                                        <p className={Style.tokenDetail}>
                                            Enter Price in ETH
                                        </p>
                                        <input
                                            type="text"
                                            className={Style.inputbox}
                                            placeholder="Enter Price"
                                            onChange={(e) => {
                                                setPrice(e.target.value);
                                            }}
                                        />
                                        <button
                                            className={Style.offerButton}
                                            type="submit"
                                            onClick={handleUpdataListing}>
                                            Update Listing
                                        </button>
                                    </div>
                                ) : (
                                    <div>
                                        <button
                                            className={Style.offerButton}
                                            type="submit"
                                            onClick={(e) => {
                                                setUpdateClicked(true);
                                            }}>
                                            Update Listing
                                        </button>
                                        <button
                                            className={Style.offerButton}
                                            type="submit"
                                            onClick={handleCancleListing}>
                                            Cancel Listing
                                        </button>{" "}
                                    </div>
                                )
                            ) : (
                                <div>
                                    <button
                                        className={Style.offerButton}
                                        type="submit"
                                        onClick={handleBuy}>
                                        Buy
                                    </button>
                                </div>
                            )
                        ) : (
                            ""
                        )}
                        {from === "topNFTs" ? (
                            retlatedData.isOwner ? (
                                updateClicked ? (
                                    <div>
                                        <p className={Style.tokenDetail}>
                                            Enter Price in ETH
                                        </p>
                                        <input
                                            type="text"
                                            className={Style.inputbox}
                                            placeholder="Enter Price"
                                            onChange={(e) => {
                                                setPrice(e.target.value);
                                            }}
                                        />
                                        <button
                                            className={Style.offerButton}
                                            type="submit"
                                            onClick={handleUpdataListing}>
                                            Update Listing
                                        </button>
                                    </div>
                                ) : (
                                    <div>
                                        <button
                                            className={Style.offerButton}
                                            type="submit"
                                            onClick={(e) => {
                                                setUpdateClicked(true);
                                            }}>
                                            Update Listing
                                        </button>
                                        <button
                                            className={Style.offerButton}
                                            type="submit"
                                            onClick={handleCancleListing}>
                                            Cancel Listing
                                        </button>{" "}
                                    </div>
                                )
                            ) : (
                                <div>
                                    <button
                                        className={Style.offerButton}
                                        type="submit"
                                        onClick={handleBuy}>
                                        Buy
                                    </button>
                                </div>
                            )
                        ) : (
                            ""
                        )}
                        {from === "profileNotListed" ? (
                            <div>
                                <p className={Style.tokenDetail}>
                                    Enter Price in ETH
                                </p>
                                <input
                                    type="number"
                                    className={Style.inputbox}
                                    placeholder="Enter Price"
                                    onChange={(e) => {
                                        setPrice(e.target.value);
                                    }}
                                />
                                <button
                                    className={Style.offerButton}
                                    type="submit"
                                    onClick={handleListitems}>
                                    List Item
                                </button>
                            </div>
                        ) : (
                            ""
                        )}
                        {from === "profileListed" ? (
                            updateClicked ? (
                                <div>
                                    <p className={Style.tokenDetail}>
                                        Enter Price in ETH
                                    </p>
                                    <input
                                        type="text"
                                        className={Style.inputbox}
                                        placeholder="Enter Price"
                                        onChange={(e) => {
                                            setPrice(e.target.value);
                                        }}
                                    />
                                    <button
                                        className={Style.offerButton}
                                        type="submit"
                                        onClick={handleUpdataListing}>
                                        Update Listing
                                    </button>
                                </div>
                            ) : (
                                <div>
                                    <button
                                        className={Style.offerButton}
                                        type="submit"
                                        onClick={(e) => {
                                            setUpdateClicked(true);
                                        }}>
                                        Update Listing
                                    </button>
                                    <button
                                        className={Style.offerButton}
                                        type="submit"
                                        onClick={handleCancleListing}>
                                        Cancel Listing
                                    </button>{" "}
                                </div>
                            )
                        ) : (
                            ""
                        )}
                    </div>
                </div>
            </div>
        );
    }
};

export default DetailsPage;
