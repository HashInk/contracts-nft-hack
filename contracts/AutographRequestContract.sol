//SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./CelebrityContract.sol";
import "./AutographContract.sol";

contract AutographRequestContract is Ownable {

    // Structs
    struct Request {
        address from;
        address to;
        uint price;
        uint responseTime;
        uint created;
    }

    // Variables
    CelebrityContract private celebrityContract;
    AutographContract private autographContract;
    Request[] private requests;
    uint private feePercent;

    // Events
    event RequestCreated(uint id, address indexed from, address indexed to, uint price, uint responseTime, uint created);
    event RequestDeleted(uint id, address indexed from, address indexed to, uint price, uint responseTime, uint created);
    event RequestSigned(uint id, address indexed from, address indexed to, uint price, uint responseTime, uint created, string nftHash, string metadata);

    /**
     * Contract constructor.
     * - _autographContract: NFT Token address.
     */
    constructor(address _celebrityContract, address _autographContract) {
        celebrityContract = CelebrityContract(_celebrityContract);
        autographContract = AutographContract(_autographContract);
        feePercent = 10; // %
    }

    /**
     * Function used to request a new NFT (autograph) to a celeb.
     * - to: Celeb address or recipient.
     * - responseTime: Request response time.
     */
    function createRequest(address to) public payable {     
        (,uint price, uint responseTime) = celebrityContract.getCelebrity(to);
        require(msg.value == price, 'The amount paid is not equal to the sale price');

        // Adding paid price to contract balance
        Request memory newRequest = Request(msg.sender, to, price, responseTime, block.timestamp);
        requests.push(newRequest);
        uint id = requests.length - 1;

        emit RequestCreated(id, newRequest.from, newRequest.to, newRequest.price, newRequest.responseTime, newRequest.created);
    }

    /**
     * Method used to remove a request after the locking period expired.
     * - id: Request index.
     * - responseTime: Request response time. 
     */
    function deleteRequest(uint id) public {
        Request memory request = requests[id];
        require(request.from == msg.sender, 'You are not the owner of the request');
        require(block.timestamp >= request.created + (request.responseTime * 1 days), 'You must wait the response time to delete this request');
        
        // Transfering amount payed to user
        payable(msg.sender).transfer(request.price);
        delete requests[id];

        emit RequestDeleted(id, request.from, request.to, request.price, request.responseTime, request.created);
    }

    function signRequest(uint id, string memory nftHash, string memory metadata) public {
        Request memory request = requests[id];

        require(request.to == msg.sender, 'You are not the recipient of the request');
        require(address(this).balance >= request.price, 'Balance should be greater than request price');

        // Minting the NFT
        // TODO: !!!!!!!!!!!!!!!!!!!!!!!
        // TODO: Check if token has been minted successfully

        // Adding request price to celeb balance
        address payable addr = payable(request.to);

        // Transfering payment to celebrity
        addr.transfer(request.price);

        emit RequestSigned(id, request.from, request.to, request.price, request.responseTime, request.created, nftHash, metadata);
    }

    /**
     * Method used to return the contract balance.
     */
    function getBalance() public view returns (uint) {
        return address(this).balance;
    }

}