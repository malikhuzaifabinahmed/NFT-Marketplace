import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";
import { create as ipfsHttpClient } from "ipfs-http-client";
//Internal import
import Style from "./CreateCollectionPage.module.css";
import images from "../img";
import { AppContext } from "@/States/states";
import { Bs0Square, BsBox, BsImage } from "react-icons/bs";
import { web3Handler } from "@/Utilities/walletdataprovider";
import { ethers } from "ethers";
import MyNFT from "contractsData/MyNFT.json";
import { set } from "mongoose";
const apiUrl = "http://localhost:3000/";

const INFURA_ID = "2JjJPXIyYtPJHn2KgiidjStbaCV";
const INFURA_KEY = "ecbb48f5db648dcbb1930377909ed321";

const auth =
    "Basic " + Buffer.from(INFURA_ID + ":" + INFURA_KEY).toString("base64");
const client = ipfsHttpClient({
    host: "ipfs.infura.io",
    port: 5001,
    protocol: "https",
    headers: {
        authorization: auth,
    },
});
const CreateCollectionPage = () => {
    const [collectionName, setCollectionName] = useState();
    const [Description, setDescription] = useState();
    const [Category, setcatagory] = useState();
    const [external_link, setexternal_link] = useState();

    const [selectedImage, setSelectedImage] = useState();
    const [selectedCoverImage, setSelectedCoverImage] = useState();
    const [account, setAccount] = useState();
    const [signer, setSigner] = useState();
    const [ipfsImage, setIpfsImage] = useState();

    console.log(collectionName, Description, ipfsImage);
    useEffect(() => {
        web3Handler()
            .then((signer, account) => {
                setAccount(account);
                setSigner(signer);
            })
            .catch((err) => {
                console.log(err);
            });
    });
    const uploadToIPFS = async (event) => {
        event.preventDefault();
        const file = event.target.files[0];
        if (typeof file !== "undefined") {
            try {
                const result = await client.add(file);
                setIpfsImage(
                    `https://nfts-pieas.infura-ipfs.io/ipfs/${result.path}`
                );
            } catch (error) {
                console.log("ipfs image upload error: ", error);
            }
        }
    };

    const createmetadata = async () => {
        if (!ipfsImage || !collectionName || !Description || !external_link)
            return "Complete all Fields";
        try {
            const metadatauri = await client.add(
                JSON.stringify({
                    ipfsImage,
                    collectionName,
                    Description,
                    external_link,
                })
            );
            CreateCollection(metadatauri);
        } catch (error) {
            console.error(error);
        }
    };
    const CreateCollection = async (metadatauri) => {
        try {
            const collectionfactory = new ethers.ContractFactory(
                MyNFT.abi,
                MyNFT.bytecode,
                signer
            );
            collectionfactory
                .deploy()
                .then((txhash) => {
                    txhash
                        .wait()
                        .then((receipt) => {
                            uploadImage(coverImage, "cover");
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                })
                .catch((err) => {
                    console.log(err);
                });
        } catch (e) {
            console.error(e);
        }
    };
    const uploadImage = async (event, field) => {
        event.preventDefault();
        const file = event.target.files[0];
        if (typeof file !== "undefined") {
            try {
                const formData = new FormData();
                formData.append("image", file);
                formData.append("address");

                let url = apiUrl + "upload";
                fetch(url, {
                    method: "POST",
                    body: formData,
                })
                    .then((response) => response.json())
                    .then((data) => {
                        console.log("Upload successful:", data);

                        if (field == "cover") {
                            setSelectedCoverImageName(data.filename);
                        }

                        // Handle the response from the server
                        //react toastify
                    })
                    .catch((error) => {
                        console.log("Error:", error);
                        // Handle error case
                    });
            } catch (error) {
                console.log("image upload error: ", error);
            }
        }
    };
    const handleCoverImageChange = (e) => {
        setSelectedCoverImage(URL.createObjectURL(e.target.files[0]));
        // uploadImage(e, "cover");
    };
    const handleProfileImageChange = (event) => {
        setSelectedImage(URL.createObjectURL(event.target.files[0]));
        uploadToIPFS(event);
    };
    return (
        <>
            <div className={Style.container}>
                <div className={Style.leftContainer}>
                    <div className={Style.coverImage}>
                        <div>
                            <label className={Style.coverImageLabel}>
                                Upload Cover Image
                            </label>
                            {!selectedCoverImage && (
                                <BsImage
                                    htmlFor="coverImageUpload"
                                    style={{
                                        width: "200px   ",
                                        height: "200px",
                                        border: "1px solid black",
                                        cursor: "pointer",
                                    }}
                                    className={Style.collectionNameInput}
                                    onClick={() =>
                                        document
                                            .getElementById("coerImageInput")
                                            .click()
                                    }></BsImage>
                            )}
                            <input
                                type="file"
                                id="coerImageInput"
                                accept="image/*"
                                hidden
                                onChange={handleCoverImageChange}
                            />
                            {selectedCoverImage && (
                                <label>
                                    <img
                                        src={selectedCoverImage}
                                        alt="uploaded image"
                                        style={{
                                            width: "200px",
                                            height: "200px",
                                            border: "1px solid black",
                                        }}
                                    />
                                </label>
                            )}
                        </div>
                    </div>

                    <div className={Style.collectionName}>
                        <label htmlFor="collectionNameInput">
                            Collection Name
                        </label>
                        <input
                            type="text"
                            id="  collectionNameInput"
                            className={Style.collectionNameInput}
                            placeholder="Name"
                            onChange={(e) => setCollectionName(e.target.value)}
                        />
                    </div>
                    <div className={Style.collectionDescription}>
                        <label htmlFor="collectionDescriptionInput">
                            Description
                        </label>
                        <textarea
                            id="collectionDescriptionInput"
                            className={Style.collectionDescriptionInput}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                </div>
                <div className={Style.rightContainer}>
                    <div className={Style.coverImage}>
                        <div>
                            <label className={Style.coverImageLabel}>
                                Upload Profile Image
                            </label>
                            {!selectedImage && (
                                <BsImage
                                    htmlFor="coverImageUpload"
                                    style={{
                                        width: "200px   ",
                                        height: "200px",
                                        border: "1px solid black",
                                        cursor: "pointer",
                                    }}
                                    className={Style.collectionNameInput}
                                    onClick={() =>
                                        document
                                            .getElementById("imageInput")
                                            .click()
                                    }></BsImage>
                            )}
                            <input
                                type="file"
                                id="imageInput"
                                accept="image/*"
                                hidden
                                onChange={handleProfileImageChange}
                            />
                            {selectedImage && (
                                <label>
                                    <img
                                        src={selectedImage}
                                        alt="uploaded image"
                                        style={{
                                            width: "200px",
                                            height: "200px",
                                            border: "1px solid black",
                                        }}
                                    />
                                </label>
                            )}
                        </div>
                    </div>
                    <div className={Style.relatedLinks}>
                        <label htmlFor="external_linkInput">
                            Related Links
                        </label>
                        <input
                            type="text"
                            id="external_linkInput"
                            className={Style.relatedLinksInput}
                            onChange={(e) => setexternal_link(e.target.value)}
                        />
                    </div>
                </div>
            </div>
            <div>
                <button
                    className={Style.submitButton}
                    type="submit"
                    onClick={createmetadata}>
                    CREATE COLLECTION
                </button>
            </div>
        </>
    );
};

export default CreateCollectionPage;
