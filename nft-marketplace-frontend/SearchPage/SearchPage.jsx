import React, { useEffect, useState } from "react";
import { BsSearch, BsArrowRight } from "react-icons/bs";
import CollectionGroup from "../components/CollectionCard/collection-group";
import Popular from "@/components/Popular/Popular";
import Style from "./SearchPage.module.css";
import { useRouter } from "next/router";

const SearchPage = ({ collectionname }) => {
    // Get the query parameter from the URL

    const [searchItem, setSearchItem] = useState(query || "");

    const [collections, setCollections] = useState([]);
    const handleClick = () => {
        router.push("/collections");
    };

    useEffect(() => {
        fetch(`https://localhost:3000/search/${collectionname}`, {}).then(
            async (resp) => {
                // console.log("rasp", resp.json());
                const data = await resp.json();
                console.log("data", data);
                setCollections(data);
            }
        );
    }, [collectionname]);

    return (
        <div className={Style.SearchPage}>
            <div className={Style.SearchPage_box}>
                <BsSearch className={Style.SearchPage_box_icon} />
                <input
                    type="text"
                    placeholder="Type your keyword..."
                    onChange={(e) => setSearchItem(e.target.value)}
                    value={searchItem}
                />
                <BsArrowRight className={Style.SearchPage_box_icon} />
            </div>
            <div className={Style.cards}>
                <CollectionGroup
                    onCollectionCardLargeClick={handleClick}
                    collections={collections}
                />
                <Popular />
            </div>
        </div>
    );
};

export default SearchPage;
