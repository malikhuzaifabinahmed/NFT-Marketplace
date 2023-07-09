import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Nftcard from "../NfTcard/NFTcard";
//Internal import
import Style from "./Popular.module.css";

const Popular = () => {
    const [topNFTs, setTopNFTs] = useState([]);
    useEffect(() => {
        fetch("http://localhost:3000/topNFTs/")
            .then((res) => res.json())
            .then((data) => {
                setTopNFTs(data);
                sessionStorage.setItem("topNFTs", JSON.stringify(data));
            })
            .catch((err) => console.log(err));
    }, []);

    return (
        <div>
            <h1 style={{ justifyContent: "center" }}>Top NFTs</h1>
            <div className={Style.rectangle}>
                <div className={Style.product_card_grid}>
                    {topNFTs &&
                        topNFTs.map((token) => (
                            <Nftcard
                                key={token.tokenId}
                                token={token}
                                from="topNFTs"
                                collectionName="nothing"
                                collectionAddress={token.contractAddress}
                            />
                        ))}
                </div>
            </div>
        </div>
    );
};

export default Popular;
