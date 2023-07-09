import { useState, useEffect } from "react";
import React from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { Nftcard } from "../NfTcard/NFTcardindex";
import Style from "./tabs.module.css";
import OfferCard from "../offercard/offercard";

function TabGrid({ userId }) {
    const [userNFTs, setuserNFTs] = useState();

    useEffect(() => {
        fetch(`http://localhost:3000/usersdata/${userId}`, {}).then(
            async (resp) => {
                // console.log("rasp", resp.json());
                const data = await resp.json();
                console.log("data", data);
                sessionStorage.setItem(
                    "profileListed",
                    JSON.stringify(data.onSale)
                );
                sessionStorage.setItem(
                    "profileNotListed",
                    JSON.stringify(data.notListed)
                );
                sessionStorage.setItem(
                    "profileOfferCreated",
                    JSON.stringify(data.offerCreated)
                );
                sessionStorage.setItem(
                    "profileOfferReceived",
                    JSON.stringify(data.offerReceived)
                );
                setuserNFTs(data);
            }
        );
    }, [userId]);

    return (
        <div className={Style.product_grid}>
            <Tabs>
                <TabList>
                    <Tab>On Sale</Tab>
                    <Tab>Not Listed</Tab>
                    <Tab>Offers Made</Tab>
                    <Tab>Offers Recived</Tab>
                </TabList>

                <TabPanel>
                    <div className={Style.product_card_grid}>
                        {userNFTs &&
                            userNFTs.onSale.map((token) => (
                                <Nftcard
                                    key={token.tokenId}
                                    token={token}
                                    collectionName="nothing"
                                    from="profileListed"
                                    collectionAddress={token.contractAddress}
                                />
                            ))}
                    </div>
                </TabPanel>

                <TabPanel>
                    <div className={Style.product_card_grid}>
                        {userNFTs &&
                            userNFTs.notListed.map((token) => (
                                <Nftcard
                                    key={token.tokenId}
                                    token={token}
                                    from="profileNotListed"
                                    collectionName="nothing"
                                    collectionAddress={token.contractAddress}
                                />
                            ))}
                    </div>
                </TabPanel>
                <TabPanel>
                    <div className={Style.product_card_grid}>
                        {userNFTs &&
                            userNFTs.offerCreated.map((token) => (
                                <OfferCard
                                    key={token.tokenId}
                                    token={token}
                                    from="profileOfferCreated"
                                    collectionName="nothing"
                                    collectionAddress={token.contractAddress}
                                />
                            ))}
                    </div>
                </TabPanel>

                <TabPanel>
                    <div className={Style.product_card_grid}>
                        {userNFTs &&
                            userNFTs.offerReceived.map((token) => (
                                <OfferCard
                                    key={token.tokenId}
                                    token={token}
                                    from="profileOfferReceived"
                                    collectionName="nothing"
                                    collectionAddress={token.contractAddress}
                                />
                            ))}
                    </div>
                </TabPanel>
            </Tabs>
        </div>
    );
}

export default TabGrid;
