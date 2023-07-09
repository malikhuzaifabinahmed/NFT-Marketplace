import React, { useEffect, useState } from "react";
//Internal Import
import Style from "@/styles/index.module.css";
import {
    HeroSection,
    Popular,
    Category,
    CollectionGroup,
} from "@/components/componentsindex";

const Home = () => {
    const [collections, setCollections] = useState([]);

    useEffect(() => {
        try {
            fetch("http://localhost:3000/collections/top", {}).then(
                async (resp) => {
                    const data = await resp.json();
                    sessionStorage.setItem("collections", JSON.stringify(data));
                    setCollections(data);
                }
            );
        } catch (e) {}
    }, []);

    return (
        <div className={Style.homePage}>
            <HeroSection />
            <CollectionGroup collections={collections} />
            <Popular />
            {/* <Category /> */}
        </div>
    );
};

export default Home;
