import { useState, useEffect } from "react";
import React from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

import Style from "./collectiontabs.module.css";
import { Nftcard } from "../NfTcard/NFTcardindex";

function CollectionTabGrid({ collectiondata }) {
    const [listedproducts, setlistedProducts] = useState();
    const [allproducts, setallproducts] = useState();
    const handlenftcardclick = (e) => {
        console.log("token", e.target.dataset.tokenid);
    };
    useEffect(() => {
        fetch(
            `http://localhost:3000/collectionNFTs/${collectiondata.collectionAddress}`,
            {}
        ).then(async (resp) => {
            // console.log("rasp", resp.json());
            let data = await resp.json();
            console.log("data", data);
            sessionStorage.setItem(
                "collectionListed",
                JSON.stringify(data.listed)
            );
            sessionStorage.setItem(
                "collectionNotListed",
                JSON.stringify(data.notListed)
            );

            setlistedProducts(data.listed);
            setallproducts(data.notListed);
        });
    }, [collectiondata.collectionAddress]);

    return (
        <div className={Style.product_grid}>
            <Tabs>
                <TabList>
                    <Tab>Listed</Tab>
                    <Tab>NotListed</Tab>
                </TabList>

                <TabPanel>
                    <div className={Style.product_card_grid}>
                        {listedproducts &&
                            listedproducts.map((token) => (
                                <Nftcard
                                    key={token.tokenId}
                                    token={token}
                                    collectionAddress={
                                        collectiondata.collectionAddress
                                    }
                                    from="collectionListed"
                                    collectionName="nothing"
                                />
                            ))}
                    </div>
                </TabPanel>

                <TabPanel>
                    <div className={Style.product_card_grid}>
                        {allproducts &&
                            allproducts.map((token) => (
                                <Nftcard
                                    key={token.tokenId}
                                    token={token}
                                    collectionName="nothing"
                                    from="collectionNotListed"
                                    collectionAddress={
                                        collectiondata.collectionAddress
                                    }
                                />
                            ))}
                    </div>
                </TabPanel>
            </Tabs>
        </div>
    );
}

export default CollectionTabGrid;
