import React, { useEffect, useState, useContext } from "react";

//INTERNAL IMPORT
import Style from "../styles/uploadNFT.module.css";
import { ProfileSetting } from "../Profilesettings/ProfileSettingsIndex";
import { AppContext } from "@/States/states";
const uploadNFT = () => {
    return (
        <div className={Style.uploadNFT}>
            <div className={Style.uploadNFT_box}>
                <div className={Style.uploadNFT_box_heading}>
                    <h1>Profile Settings</h1>
                </div>

                <div className={Style.uploadNFT_box_form}>
                    <ProfileSetting />
                </div>
            </div>
        </div>
    );
};

export default uploadNFT;
