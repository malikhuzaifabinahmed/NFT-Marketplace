import React, { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
//INTERNAL IMPORT
import Style from "../styles/search.module.css";
import { SearchPage } from "@/SearchPage/SearchPageIndex";

const search = () => {
    const router = useRouter();

    const { collectionname } = router.query;
    console.log(collectionname);
    return (
        <div className={Style.search}>
            <div className={Style.search_box}>
                <div className={Style.search_box_heading}></div>
                These will be the searches of the user.
                <div className={Style.search_box_form}>
                    {/* <SearchPage collectionname={collectionname} /> */}
                </div>
            </div>
        </div>
    );
};

export default search;
