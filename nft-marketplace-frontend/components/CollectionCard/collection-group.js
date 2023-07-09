import styles from "./collection-group.module.css";
import { Button } from "@/components/componentsindex";
import Style from "../Button/Button.module.css";
import { ethers } from "ethers";
import { useRouter } from "next/router";

const CollectionCard = ({ row, index }) => {
    function weiToEth(wei) {
        const ether = ethers.formatEther(wei);
        return ether;
    }
    const Router = useRouter();

    const handleClick = () => {
        Router.push({
            pathname: "/collections",
            query: {
                index,
            },
        });
    };
    return (
        <div
            key={"collection-" + index}
            className={styles.collectionCardLarge}
            onClick={handleClick}>
            <div className={styles.imageFramerectangle}>
                <div className={styles.images}>
                    <img
                        className={styles.image6Icon}
                        alt=""
                        src={row.metadata.image}
                    />
                </div>
            </div>
            <div className={styles.text3242}>
                <div className={styles.name}>{row.name}</div>
            </div>
            <div className={styles.text32421}>
                <div className={styles.name1}>
                    {row.totalSupplyOfCollection}
                </div>
            </div>
            <div className={styles.text32422}>
                <div className={styles.name1}>
                    {weiToEth(row.floorprice)} ETH
                </div>
            </div>
            <div className={styles.text32423}>
                <div className={styles.name1}>
                    {weiToEth(row.totalvolume)} ETH Volume
                </div>
            </div>
        </div>
    );
};

const CollectionGroup = ({ collections }) => {
    return (
        <>
            {" "}
            <div
                className={Style.h2}
                style={{ display: "block", margin: "0 auto" }}>
                <h2>Most popular Collections</h2>
            </div>
            <div className={styles.collectionCardLargeParent}>
                {collections.length > 0
                    ? collections.map(
                          (row, index) =>
                              index <= 3 && (
                                  <CollectionCard
                                      row={row}
                                      key={index}
                                      index={index}
                                  />
                              )
                      )
                    : null}
            </div>
            <div className={Style.box}>
                <button
                    className={Style.button}
                    style={{ display: "block", margin: "0 auto" }}>
                    View Collections
                </button>
            </div>
        </>
    );
};

export default CollectionGroup;
