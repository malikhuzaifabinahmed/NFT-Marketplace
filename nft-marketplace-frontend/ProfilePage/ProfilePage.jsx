import React, { useState, useContext, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { account, AppContext } from "@/States/states";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { User } from "@/components/userprofileheader/UserProfileHeaderIndex";
//Internal import
import Styles from "./ProfilePage.module.css";
import { BsSearch } from "react-icons/bs";
import img from "@/img";
import { TabGrid } from "@/components/Tabs/tabsindex";
import { web3Handler } from "Utilities/walletdataprovider";

const ProfilePage = () => {
    const [account, setaccount] = useState();

    useEffect(() => {
        web3Handler()
            .then((res) => {
                console.log(res);
                setaccount(res.account[0]);
            })
            .catch((e) => {
                console.log(e);
            });
    }, []);

    return (
        <div className={Styles.container}>
            <div className={Styles.profileContainer}>
                {account && <User userId={account} />}
            </div>
            {account && <TabGrid userId={account} />}
        </div>
    );
};

export default ProfilePage;
