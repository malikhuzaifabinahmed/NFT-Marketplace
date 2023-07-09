// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./MyNFT.sol";

contract CollectionFactory {

event CollectionCreated(address indexed owner, address indexed contractAddress ,string metadataUrl);

    function createCollection(
        string memory name,
        string memory symbol,
        string memory metadataUrl
    ) public {
        MyNFT contractInstance = new MyNFT(
            name,
            symbol,
            msg.sender,
            metadataUrl
        );
        emit CollectionCreated(msg.sender, address(contractInstance),metadataUrl);
    }
}
