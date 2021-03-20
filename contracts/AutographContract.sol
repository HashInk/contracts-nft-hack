//SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "hardhat/console.sol";

contract AutographContract is ERC721 {

    // Variables
    using Counters for Counters.Counter;
    Counters.Counter private tokenIds;
    mapping(string => uint8) hashes;

    /**
     * Contract constructor.
     */
    constructor() ERC721("HashInk Token", "HINK") {
        //_setBaseURI("https://ipfs.io/ipfs/");
    }

    /** 
     * Function used to mint a new NFT.
     * _to: Person's wallet address who will receive the NFT.
     * _hash: IPFS hash associated with the content we are creating the NFT for.
     * _tokenURI: Link to an image referencing the asset. Might include the asset name, a link to an image referencing the asset, or anything you want.
     */
    function mint(address to, string memory hash, string memory metadata) public returns (uint) {
        require(hashes[hash] != 1); // Automatically reject the contract call if the hash has been used to mint an NFT before.
        hashes[hash]=1;
        tokenIds.increment();
        uint id = tokenIds.current();

        _safeMint(to, id);
        _setTokenURI(id, metadata);

        return id;
    }

}