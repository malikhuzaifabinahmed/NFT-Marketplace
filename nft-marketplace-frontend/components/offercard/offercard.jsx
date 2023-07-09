import { useEffect, useState } from "react";
import styles from "./offercard.module.css";
import CountdownComponent from "../countdown/countDown";
import { ethers } from "ethers";
import { useRouter } from "next/router";
const OfferCard = ({ token, from, collectionAddress }) => {
    function weiToEth(wei) {
        const ether = ethers.formatEther(wei);
        return ether;
    }
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
        <div className={styles.collectionCardLarge} onClick={handleClick}>
            <div className={styles.imageFramerectangle}>
                <div className={styles.images}>
                    <img
                        className={styles.image6Icon}
                        alt=""
                        src={token.tokenData.image}
                    />
                </div>
            </div>
            <div className={styles.text3242}>
                <div className={styles.name}>{token.tokenData.name}</div>
            </div>
            <div className={styles.text32423}>
                <div className={styles.name1}>{token.collectionName}</div>
            </div>
            <div className={styles.text32422}>
                <div className={styles.name1}>{weiToEth(token.price)} ETH</div>
            </div>

            <div className={styles.text32421}>
                <div className={styles.name1}>
                    <CountdownComponent remainingSeconds={token.endtime} />
                </div>
            </div>
        </div>
    );
};
export default OfferCard;
