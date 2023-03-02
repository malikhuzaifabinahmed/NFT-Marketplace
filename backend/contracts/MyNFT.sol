// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyNFT is ERC721URIStorage, Ownable {
    uint256 private _tokenIdCounter;

    constructor(
        string memory name,
        string memory symbol,
        address owner
    ) ERC721(name, symbol) {
        _transferOwnership(owner);
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
    ) public override onlyOwner {
        super.transferFrom(from, to, tokenId);
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        bytes memory data
    ) public override {
        super.safeTransferFrom(from, to, tokenId, data);
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public override {
        super.safeTransferFrom(from, to, tokenId);
    }
}
