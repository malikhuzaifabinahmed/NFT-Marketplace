// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./MyNFT.sol";

contract CollectionFactory {
    struct Collection {
        MyNFT contractInstance;
        string name;
        string symbol;
        address owner;
    }

    Collection[] private collections;
    mapping(address => uint[]) public collectionsByOwner;

    event CollectionCreated(address indexed owner, address contractAddress);

    function createCollection(string memory name, string memory symbol) public {
        MyNFT contractInstance = new MyNFT(name, symbol, msg.sender);
        Collection memory newCollection = Collection({
            contractInstance: contractInstance,
            name: name,
            symbol: symbol,
            owner: msg.sender
        });
        uint id = collections.length;
        collections.push(newCollection);
        collectionsByOwner[msg.sender].push(id);
        emit CollectionCreated(msg.sender, address(contractInstance));
    }

    function getCollection(
        uint index
    ) public view returns (address, string memory, string memory, address) {
        Collection memory collection = collections[index];
        return (
            address(collection.contractInstance),
            collection.name,
            collection.symbol,
            collection.owner
        );
    }

    function getCollectionsByOwner(
        address owner
    ) public view returns (address[] memory) {
        uint[] memory collectionIds = collectionsByOwner[owner];
        address[] memory result = new address[](collectionIds.length);
        for (uint i = 0; i < collectionIds.length; i++) {
            result[i] = address(collections[collectionIds[i]].contractInstance);
        }
        return result;
    }
}
