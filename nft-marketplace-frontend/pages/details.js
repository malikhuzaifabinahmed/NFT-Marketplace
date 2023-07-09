import React, { useEffect, useState, useContext } from "react";

//INTERNAL IMPORT
import Style from "../styles/details.module.css";
import { DetailsPage } from "../DetailsPage/DetailsPageIndex";
import { useRouter } from "next/router";
import { web3Handler } from "@/Utilities/walletdataprovider";
import { reactStrictMode } from "@/next.config";

const details = () => {
    const [retlatedData, setRetlatedData] = useState();
    const [nftData, setNftData] = useState();

    const router = useRouter();
    const { tokenId, colectionAddress, from } = router.query;
    var requestOptions = {
        method: "GET",
        redirect: "follow",
    };

    useEffect(() => {
        if (tokenId && colectionAddress && from) {
            web3Handler().then(({ account }) => {
                console.log(tokenId, colectionAddress, account[0]);

                fetch(
                    `http://localhost:3000/checkData/${tokenId}/${colectionAddress}/${account[0]}`,
                    requestOptions
                )
                    .then((res) => res.json())
                    .then((data) => {
                        console.log(data);
                        setRetlatedData(data);
                    });
            });
        }
        if (from) {
            let data = sessionStorage.getItem(from);
            let jsondata = JSON.parse(data);

            setNftData(jsondata.find((token) => token.tokenId == tokenId));
        }
    }, [from, colectionAddress, tokenId]);

    if (!tokenId) {
        return "Loading";
    }

    return (
        <div className={Style.details}>
            <div className={Style.details_box}>
                <div className={Style.details_box_heading}></div>

                <div className={Style.details_box_form}>
                    {nftData && retlatedData && (
                        <DetailsPage
                            tokenId={tokenId}
                            collectionAddress={colectionAddress}
                            nftData={nftData}
                            from={from}
                            retlatedData={retlatedData}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default details;
