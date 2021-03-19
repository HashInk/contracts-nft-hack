const { ethers } = require("hardhat");
const { use, expect, assert } = require("chai");
const { solidity } = require("ethereum-waffle");

var BigNumber = require('big-number');

use(solidity);

describe("Hashink Contracts", function () {

    let AutographRequestContract, AutographContract, CelebrityContract;
    let requestsContract, autographContract, celebrityContract;
    let owner;
    let addr1;
    let addr2;
    let addrs;
    let name;
    let price;
    let responseTime;

    beforeEach(async function () {

        // Initializing variables
        name = "Justin Shenkarow";
        price = ethers.utils.parseEther('2');
        responseTime = 2;
    
        // Deploying celebrities contract
        CelebrityContract = await ethers.getContractFactory("CelebrityContract");
        celebrityContract = await CelebrityContract.deploy();
        expect(celebrityContract.address).to.properAddress;

        // Deploying autograph contract
        AutographContract = await ethers.getContractFactory("AutographContract");
        autographContract = await AutographContract.deploy();
        expect(autographContract.address).to.properAddress;

        // Deploying requests contract
        AutographRequestContract = await ethers.getContractFactory("AutographRequestContract");
        requestsContract = await AutographRequestContract.deploy(celebrityContract.address, autographContract.address);
        expect(requestsContract.address).to.properAddress;

        // Getting tests accounts
        [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    });

    describe("Celebrity Contract", function() {

        it("Should create a new celebrity", async function () { 
            responseTime = 2;

            await expect(
                celebrityContract.connect(addr1).createCelebrity(name, price, responseTime)
            )
            .to.emit(celebrityContract, 'CelebrityCreated');
            
            const celeb = await celebrityContract.getCelebrity(addr1.address);
            expect(celeb[0]).to.equal(name);
            expect(celeb[1]).to.equal(price);
            expect(celeb[2]).to.equal(responseTime);
        });

        it("Should update celebrity information", async function () {
            await celebrityContract.connect(addr1).createCelebrity("Vitalik Buterin", ethers.utils.parseEther('1'), 4);
            await celebrityContract.connect(addr1).createCelebrity(name, price, responseTime);
            
            const celeb = await celebrityContract.getCelebrity(addr1.address);
            expect(celeb[0]).to.equal(name);
            expect(celeb[1]).to.equal(price);
            expect(celeb[2]).to.equal(responseTime);
        });
    
    });

    describe("Request Contract", function() {

        describe("Create Request", function() {

            it("Should create a new autograph request", async function () {
                await celebrityContract.connect(addr1).createCelebrity(name, price, responseTime);
                await expect(
                    requestsContract.connect(addr2).createRequest(addr1.address, {value: price}))
                .to.emit(requestsContract, 'RequestCreated');

                expect(await requestsContract.getBalance()).to.equal(price);
                expect(await requestsContract.getBalance()).to.equal(price);
            });
        
        });

        describe("Delete Request", function() {

            it("Should be able to delete a request when locking period expired", async function () {
                responseTime = 0;
                
                await celebrityContract.connect(addr1).createCelebrity(name, price, responseTime);
                await requestsContract.connect(addr2).createRequest(addr1.address, {value: price});
                expect(await requestsContract.getBalance()).to.equal(price);

                await requestsContract.connect(addr2).deleteRequest(0);
                expect(await requestsContract.getBalance()).to.equal(0);
            });

            it("Shouldn't delete a request before locking period expired", async function () {
                await celebrityContract.connect(addr1).createCelebrity(name, price, responseTime);
                await requestsContract.connect(addr2).createRequest(addr1.address, {value: price});

                await expect(
                    requestsContract.connect(addr2).deleteRequest(0)
                ).to.be.revertedWith('You must wait the response time to delete this request');
            });

            it("Shouldn't delete a request when sender is not the owner ", async function () {
                const responseTime = 0;
                
                await celebrityContract.connect(addr1).createCelebrity(name, price, responseTime);
                await requestsContract.connect(addr2).createRequest(addr1.address, {value: price});

                await expect(
                    requestsContract.connect(addrs[0]).deleteRequest(0)
                ).to.be.revertedWith('You are not the owner of the request');
            });

        });

    });

});