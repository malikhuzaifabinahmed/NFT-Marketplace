import React, { useState, useContext, useEffect } from "react";
import "react-tabs/style/react-tabs.css";
//Internal import
import Styles from "./Collection_page.module.css";
import { CollectionTabGrid } from "@/components/CollectionsTabs/collectiontabsindex";
import { CollectionHeader } from "@/components/collectionheader/UserProfileHeaderIndex";

const CollectionPage = ({ index }) => {
    const [collectiondata, setcollectiondata] = useState();

    // console.log(account1);

    const handleEditUsernameClick = () => {
        // handle edit username action
    };

    const handleSettingsButtonClick = () => {
        // handle settings button click action
    };

    const handleCreateNFTButtonClick = () => {
        // handle create NFT button click action>
    };

    const handleTabClick = (tabName) => {
        // handle tab click action
    };

    const handleSearch = (searchTerm) => {
        // handle search action
    };
    useEffect(() => {
        let data = sessionStorage.getItem("collections");
        console.log(data);
        data = JSON.parse(data);
        setcollectiondata(data[index]);
    }, [index]);

    if (!collectiondata) return <div>Loading ..</div>;

    return (
        <div className={Styles.container}>
            <div className={Styles.profileContainer}>
                {collectiondata ? (
                    <CollectionHeader collectiondata={collectiondata} />
                ) : (
                    "Loading............"
                )}
            </div>
            {collectiondata ? (
                <CollectionTabGrid collectiondata={collectiondata} />
            ) : (
                "Loading............"
            )}
        </div>
    );
};

export default CollectionPage;
