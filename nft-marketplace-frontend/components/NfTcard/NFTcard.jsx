import { useEffect, useState } from "react";
import Style from "./nftcard.module.css";
import { ethers } from "ethers";
import { useRouter } from "next/router";
function weiToEth(wei) {
    const ether = ethers.formatEther(wei);
    return ether;
}

function Nftcard({ token, collectionName, collectionAddress, from }) {
    const router = useRouter();

    const handleClick = () => {
        router.push({
            pathname: "/details",
            query: {
                tokenId: token.tokenId,
                colectionAddress: collectionAddress,
                from: from,
            },
        });
    };

    return (
        <div className={Style.product_Card} onClick={handleClick}>
            <div className={Style.product_Image}>
                <img src={token.tokenData.image} alt={token.tokenData.name} />
            </div>
            <div className={Style.product_info}>
                <div className={Style.product_name}>{token.tokenData.name}</div>
                <div className={Style.product_price}>
                    {(token.price && weiToEth(token.price)) || "Notlisted Yet"}{" "}
                    ETH
                </div>
                <div className={Style.product_collection}>{collectionName}</div>
                <div className={Style.product_rating}></div>
            </div>
        </div>
    );
}

export default Nftcard;
