import React, { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
//INTERNAL IMPORT
import Style from "../styles/profile.module.css";
import { CollectionPage } from "../Collection_page/Collection_pageIndex";

const collections = () => {
    const router = useRouter();

    const { index } = router.query;

    return (
        <div className={Style.profile}>
            <div className={Style.profile_box}>
                <div className={Style.profile_box_heading}></div>

                <div className={Style.profile_box_form}>
                    <CollectionPage index={index} />
                </div>
            </div>
        </div>
    );
};

export default collections;
