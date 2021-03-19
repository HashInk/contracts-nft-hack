//SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

import "hardhat/console.sol";

/**
 * This contract manages celebrities information on-chain.
 */
contract CelebrityContract {

    // Structs
    struct Celebrity {
        string name;
        uint price;
        uint responseTime;
    }

    // Variables
    mapping(address => Celebrity) public celebrities;

    // Events
    event CelebrityCreated(address indexed owner, string name, uint price, uint responseTime);
    event CelebrityDeleted(address indexed owner);
    event CelebrityUpdated(address indexed owner, string name, uint price, uint responseTime);

    /**
     * Constructor method.
     */
    constructor () {}

    /**
     * Function used to request a new NFT (autograph) to a celeb.
     * - name: Celebrity name.
     * - price: Celebrity current autograph price.
     * - responseTime: Celebrity response time.
     */
    function createCelebrity(string memory name, uint price, uint responseTime) public {
        Celebrity memory newCelebrity = Celebrity(name, price, responseTime);
        celebrities[msg.sender] = newCelebrity;

        emit CelebrityCreated(msg.sender, newCelebrity.name, newCelebrity.price, newCelebrity.responseTime);
    }

    /**
     * Delete a celebrity.
     */
    function deleteCelebrity() public {
        delete celebrities[msg.sender];
        
        emit CelebrityDeleted(msg.sender);
    }

    /**
     * Update celebrity information.
     * - name: Celebrity name.
     * - price: Celebrity current autograph price.
     * - responseTime: Celebrity response time.
     */
    function updateCelebrity(string memory name, uint price, uint responseTime) public {
        celebrities[msg.sender].name = name;
        celebrities[msg.sender].price = price;
        celebrities[msg.sender].responseTime = responseTime;

        emit CelebrityUpdated(msg.sender, name, price, responseTime);
    }

    /**
     * Gets celebrity information by address.
     * - addr: Celebrity account address.
     */
    function getCelebrity(address addr) public view returns (
        string memory name, uint price, uint responseTime) {
        return (celebrities[addr].name, celebrities[addr].price, celebrities[addr].responseTime);
    }

}