import React, { useState, useEffect, useContext } from "react";
import Image from "next/image";
import Link from "next/link";

import { AppContext } from "@/States/states";
//Import icons
import { BsMenuDown, BsSearch } from "react-icons/bs";
import { CgMenuLeft, CgMenuRight } from "react-icons/cg";
import { useRouter } from "next/router";
import { web3Handler } from "@/Utilities/walletdataprovider";
//Internal Import
import Style from "./NavBar.module.css";
import {
    Categories,
    CreateNFT,
    Profile,
    ConnectWallet,
    SideBar,
} from "./index";
import { Button } from "../componentsindex";
import image from "../../img";
import { Accordion } from "react-bootstrap";

function NavBar() {
    //UseState Component

    const [categories, setCategories] = useState(false);
    const [openSideMenu, setOpenSideMenu] = useState(false);
    const [connectButton, setConnectButton] = useState("Connect to Wallet");
    const [auth, setatuh] = useState(false);
    const [walletData, setWalletData] = useState([]);
    const [searchbar, setSearchBar] = useState("");
    const Router = useRouter();
    const openMenu = (e) => {
        const btnText = e.target.innerText;
        if (btnText == "Categories") {
            setCategories(true);
        } else {
            setCategories(false);
        }
    };
    const handleSearch = (event) => {
        Router.push({
            pathname: "/search",
            query: {
                collectionname: searchbar,
            },
        });
    };
    const disconnectbutton = () => {
        setatuh(false);
        sessionStorage.removeItem("walletData");
    };

    useEffect(() => {
        let data = sessionStorage.getItem("walletData");
        data = JSON.parse(data);
        setWalletData(data);
        if (data) {
            setatuh(true);
        }
        setWalletData(walletData);
    });
    const openSideBar = () => {
        if (!openSideMenu) {
            setOpenSideMenu(true);
        } else {
            setOpenSideMenu(false);
        }
    };
    // console.log("its nav", account);
    return (
        <div className={Style.navbar}>
            <div className={Style.navbar_container}>
                {/*START OF LEFT SECTION*/}
                <div className={Style.navbar_container_left}>
                    <Link className={Style.logo} href=".">
                        <Image
                            src={image.logo}
                            alt="NFT Marketplace logo"
                            width={100}
                            height={100}
                        />
                    </Link>
                    <div className={Style.navbar_container_left_box_input}>
                        {/* <div
                            className={
                                Style.navbar_container_left_box_input_box
                            }>
                            <input
                                type="search"
                                placeholder="Search NFTs collections"
                                value={searchbar}
                                onChange={(e) => setSearchBar(e.target.value)}
                            />

                            <BsSearch
                                className={Style.search_icon}
                                onClick={handleSearch}
                            />
                        </div> */}
                    </div>
                </div>
                {/*END OF LEFT SECTION*/}

                {/*START OF RIGHT SECTION*/}
                <div className={Style.navbar_container_right}>
                    {/*  CATEGORIES MENU*/}
                    {/* <div className={Style.navbar_container_right_categories}>
                        <p onClick={(e) => openMenu(e)}>Categories</p>
                        {categories && (
                            <div
                                className={
                                    Style.navbar_container_right_categories_dropdown
                                }>
                                <Categories />
                            </div>
                        )}
                    </div> */}

                    {/*  PROFILE Button*/}
                    <Link
                        href="/profile"
                        className={Style.navbar_container_right_button_create}>
                        PROFILE
                    </Link>

                    {/*  CREATE Button*/}
                    {/* <Link
                        href="./uploadNFT"
                        className={Style.navbar_container_right_button_create}>
                        <button className={Style.createButton}>
                            CREATE NFT
                        </button>
                    </Link> */}

                    {/*  Connect Wallet Button*/}
                    <div
                        className={Style.navbar_container_right_button_connect}>
                        {auth ? (
                            <Button
                                btnName={auth ? "Disconnect" : ""}
                                handleClick={disconnectbutton}
                            />
                        ) : (
                            <Button
                                btnName={
                                    walletData.account === "NO Wallet Found"
                                        ? "NO Wallet Found"
                                        : auth
                                        ? "Connected"
                                        : "Connect to Wallet"
                                }
                                handleClick={web3Handler}
                            />
                        )}
                    </div>

                    {/*  MENU Button*/}
                    <div className={Style.navbar_container_right_menuButton}>
                        <CgMenuRight
                            className={Style.menuIcon}
                            onClick={() => openSideBar()}
                        />
                    </div>
                </div>
                {/*END OF RIGHT SECTION*/}
            </div>

            {/*  SIDEBAR COMPONENT*/}
            {openSideMenu && (
                <div className={Style.SideBar}>
                    <SideBar setOpenSideMenu={setOpenSideMenu} />
                </div>
            )}
        </div>
    );
}

export default NavBar;