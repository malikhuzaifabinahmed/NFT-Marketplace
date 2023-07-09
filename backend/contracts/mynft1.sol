// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyNFT is ERC721URIStorage, Ownable {
    uint256 public totalSupply;
    string private _urlMetadata;

    constructor(
        string memory name,
        string memory symbol,
        // address owner,
        string memory urlMetadata
    ) ERC721(name, symbol) {
        _transferOwnership(msg.sender);
        _urlMetadata = urlMetadata;
    }

    function mint(
        address to,
        string memory tokenURI
    ) public onlyOwner returns (uint256) {
        uint256 newTokenId = totalSupply;
        _mint(to, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        totalSupply++;
        return newTokenId;
    }
    function compareStrings(string memory a, string memory b) private pure returns (bool) {
    return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))));
}
    function updateContractURI(string memory url)public onlyOwner {
        string memory urlMetadata = _urlMetadata;
        require (compareStrings(urlMetadata , url),"NEW Url must be diffrent from old");
        _urlMetadata   =    url;        
    }
    function contractURI() public view returns (string memory) {
        //         {
        //   "name": "OpenSea Creatures",
        //   "description": "OpenSea Creatures are adorable aquatic beings primarily for demonstrating what can be done using the OpenSea platform. Adopt one today to try out all the OpenSea buying, selling, and bidding feature set.",
        //   "image": "external-link-url/image.png",
        //   "external_link": "external-link-url",
        //   "seller_fee_basis_points": 100, # Indicates a 1% seller fee.
        //   "fee_recipient": "0xA97F337c39cccE66adfeCB2BF99C1DdC54C2D721" # Where seller fees will be paid to.
        // }
        return _urlMetadata; //write down code to send metadata of https://docs.opensea.io/docs/contract-level-metadata    }
    }
}
