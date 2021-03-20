//SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

import "hardhat/console.sol";

/**
 * This contract manages celebrities information on-chain.
 */
contract CelebrityContract {

    // Structs
    struct Celebrity {
        uint id;
        string name;
        uint price;
        uint responseTime;
        bool exists;
    }

    // Variables
    mapping(address => Celebrity) public celebrities;
    address[] public celebrityAddresses;
    uint totalSupply;

    // Events
    event CelebrityCreated(uint id, address indexed owner, string name, uint price, uint responseTime);
    event CelebrityDeleted(uint id, address indexed owner);
    event CelebrityUpdated(uint id, address indexed owner, string name, uint price, uint responseTime);

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
        require(!celebrities[msg.sender].exists, 'This address already exists');

        Celebrity memory newCelebrity = Celebrity(0, name, price, responseTime, true);
        celebrityAddresses.push(msg.sender);
        uint id = celebrityAddresses.length - 1;
        newCelebrity.id = id;
        celebrities[msg.sender] = newCelebrity;
        totalSupply += 1;

        emit CelebrityCreated(id, msg.sender, newCelebrity.name, newCelebrity.price, newCelebrity.responseTime);
    }

    /**
     * Delete a celebrity.
     */
    function deleteCelebrity(address addr) public {
        require(addr == msg.sender, 'You are not the owner');
        uint id = celebrities[addr].id;
        delete celebrities[addr];
        delete celebrityAddresses[id];
        totalSupply -= 1;
        
        emit CelebrityDeleted(id, addr);
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

        emit CelebrityUpdated(celebrities[msg.sender].id, msg.sender, name, price, responseTime);
    }

    /**
     * Gets celebrity information by address.
     * - addr: Celebrity account address.
     */
    function getCelebrity(address addr) public view returns (
        uint id, string memory name, uint price, uint responseTime) {
        return (celebrities[addr].id, celebrities[addr].name, celebrities[addr].price, celebrities[addr].responseTime);
    }

    /**
     * Gets number of celebrities.
     */
    function getTotalSupply() public view returns (uint) {
        return totalSupply;
    }

}