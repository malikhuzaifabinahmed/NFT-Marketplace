"use client";
import { ethers } from "ethers";

export const web3Handler = async (props) => {
    // return new Promise(async (resolve, reject) => {
    if (typeof window.ethereum !== "undefined") {
        const account = await window.ethereum.request({
            method: "eth_requestAccounts",
        });

        // Get provider from Metamask
        const provider = new ethers.BrowserProvider(window.ethereum);
        // Set signer
        const signer = await provider.getSigner();

        sessionStorage.setItem(
            "walletData",
            JSON.stringify({
                account,
                provider,
                signer,
            })
        );
        return {
            account,
            provider,
            signer,
        };
    } else {
        return { account: "NO Wallet Found" };
    }
    // });
};
