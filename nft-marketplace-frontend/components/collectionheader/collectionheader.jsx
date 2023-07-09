import { useState, useEffect } from "react";
import Style from "./userprofileheader.module.css";
import axios from "axios";
import { get } from "mongoose";
import Link from "next/link";
import { headers } from "@/next.config";

const fetchData = async (userId) => {
    try {
        const uri = `http://localhost:3000/users/${userId}`;
        console.log(uri);
        const response = await fetch(uri, { mode: "cors" }); // Replace with your API endpoint
        console.log(response);
        if (response.body) {
            const data = await response.json();
            return data;
        } else {
            throw new Error("User data not found");
        }
    } catch (error) {
        console.error("Error fetching user data:", error);
        return null;
    }
};

const createDummyData = (userId) => {
    return {
        name: "User",
        userId,
        email: "dummy@example.com",
        about: "This is a dummy user.",

        profileImage:
            "1685288762724_1000_F_279669366_Lk12QalYQKMczLEa4ySjhaLtx1M2u7e6.jpg",
        coverImage:
            "1685288762724_1000_F_279669366_Lk12QalYQKMczLEa4ySjhaLtx1M2u7e6.jpg",
    };
};

function postdata(data) {
    fetch("http://localhost:3000/users/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then((responseData) => {
            console.log("Response:", responseData);
        })
        .catch((error) => {
            console.error("Error:", error);
        });
}

const handleSettingsButtonClick = () => {
    // handle settings button click action
};

const CollectionHeader = ({ collectiondata }) => {
    const [userData, setUserData] = useState(null);
    const uploadpath = "http://localhost:3000/image/";
    const coverImage =
        "0xc680819dabbf72e8942a915e3e2aeaf4f4a523e1IMG_20221217_155636.jpg";
    if (!collectiondata) {
        return <div>Loading...</div>;
    }

    // Render the user details
    return (
        <div className={Style.profile_banner}>
            <div
                className={Style.cover_image}
                style={{
                    backgroundImage: `url(${uploadpath}${coverImage})`,
                }}>
                <div className={Style.leftContainer}>
                    <div className={Style.profile_info}>
                        <div className={Style.profile_image}>
                            <img
                                src={collectiondata.metadata.image}
                                alt="Profile"
                            />
                        </div>
                        <div className={Style.profile_details}>
                            <h2>{collectiondata.name}</h2>
                            <p className={Style.wallet_address}>
                                {collectiondata.collectionAddress}
                            </p>
                        </div>
                    </div>
                </div>
                <div className={Style.rightContainer}>
                    <div>
                        {/* <Link href="./settings">
                            <button
                                className={Style.settingsButton}
                                onClick={handleSettingsButtonClick}>
                                Settings
                            </button>
                        </Link> */}
                        {/* <a href="./uploadNFT">
                                <button className={Styles.createNFTButton}>
                                    Create NFT
                                </button>
                            </a> */}
                        {/* <Link href="./uploadCollection">
                            <button className={Style.createCollectionButton}>
                                Create Collection
                            </button>
                        </Link> */}
                    </div>
                </div>
            </div>
            <div className={Style.about_section}>
                <h3>Description</h3>
                <p>{collectiondata.metadata.description}</p>
            </div>
        </div>
    );
};

export default CollectionHeader;
