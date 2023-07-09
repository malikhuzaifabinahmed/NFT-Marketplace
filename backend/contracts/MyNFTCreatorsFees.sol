// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyNFT is ERC721URIStorage, Ownable {
    uint256 private _tokenIdCounter;
    uint256 private _creatorsFees;

    constructor(
        uint256 creatorsFees,
        string memory name,
        string memory symbol,
        address owner
    ) ERC721(name, symbol) {
        _transferOwnership(owner);
        _creatorsFees = creatorsFees;
    }

    function mint(
        address to,
        string memory tokenURI
    ) public onlyOwner returns (uint256) {
        uint256 newTokenId = _tokenIdCounter;
        _mint(to, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        _tokenIdCounter++;
        return newTokenId;
    }

    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public override {}
}
