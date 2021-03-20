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
    let hash;
    let metadata;

    beforeEach(async function () {

        // Initializing variables
        name = "Justin Shenkarow";
        price = ethers.utils.parseEther('2');
        responseTime = 2;
        hash="8743b52063cd84097a65d1633f5c74f5";
        metadata="QmTgqnhFBMkfT9s8PHKcdXBn1f5bG3Q5hmBaR4U6hoTvb1";
    
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
            ).to.emit(celebrityContract, 'CelebrityCreated');
            
            const celeb = await celebrityContract.getCelebrity(addr1.address);
            expect(celeb[1]).to.equal(name);
            expect(celeb[2]).to.equal(price);
            expect(celeb[3]).to.equal(responseTime);
            expect(await celebrityContract.getTotalSupply()).to.equal(1);
        });

        it("Shouldn't create two celebrities with same address", async function () {
            await celebrityContract.connect(addr1).createCelebrity("Vitalik Buterin", ethers.utils.parseEther('1'), 4);
            await expect(
                celebrityContract.connect(addr1).createCelebrity(name, price, responseTime)
            ).to.be.revertedWith('This address already exists');
        });

        it("Should delete a celebrity", async function () {
            await celebrityContract.connect(addr1).createCelebrity(name, price, responseTime);
            expect(await celebrityContract.getTotalSupply()).to.equal(1);

            await expect(
                celebrityContract.connect(addr1).deleteCelebrity(addr1.address)
            ).to.emit(celebrityContract, 'CelebrityDeleted');
            expect(await celebrityContract.getTotalSupply()).to.equal(0);
        });

        it("Should create a celebrity after being deleted", async function () {
            await celebrityContract.connect(addr1).createCelebrity(name, price, responseTime);
            expect(await celebrityContract.getTotalSupply()).to.equal(1);

            await celebrityContract.connect(addr1).deleteCelebrity(addr1.address);
            expect(await celebrityContract.getTotalSupply()).to.equal(0)
                
            await celebrityContract.connect(addr1).createCelebrity(name, price, responseTime);
            expect(await celebrityContract.getTotalSupply()).to.equal(1);
        });

        it("Shouldn't delete a celebrity if caller isn't the owner", async function () {
            await celebrityContract.connect(addr1).createCelebrity(name, price, responseTime);
            
            await expect (
                celebrityContract.connect(addrs[0]).deleteCelebrity(addr1.address)
            ).to.be.revertedWith('You are not the owner');
        });

        it("Should update celebrity information", async function () {
            await celebrityContract.connect(addr1).createCelebrity("Vitalik Buterin", ethers.utils.parseEther('1'), 4);
            await expect (
                celebrityContract.connect(addr1).updateCelebrity(name, price, responseTime)
            ).to.emit(celebrityContract, 'CelebrityUpdated');
            
            const celeb = await celebrityContract.getCelebrity(addr1.address);
            expect(celeb[1]).to.equal(name);
            expect(celeb[2]).to.equal(price);
            expect(celeb[3]).to.equal(responseTime);
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
                expect(await requestsContract.getTotalSupply()).to.equal(1);
            });

            it("Should retrieve request info after create a new request", async function () {
                await celebrityContract.connect(addr1).createCelebrity(name, price, responseTime);
                await requestsContract.connect(addr2).createRequest(addr1.address, {value: price});

                const request = await requestsContract.getRequest(0);
                expect(request[0]).to.equal(addr2.address);
                expect(request[1]).to.equal(addr1.address);
                expect(request[2]).to.equal(price);
                expect(request[3]).to.equal(responseTime);
            });

            it("Should create many requests for a celebrity", async function () {
                price = ethers.utils.parseEther('2');
                await celebrityContract.connect(addr1).createCelebrity(name, price, responseTime);
                
                await requestsContract.connect(addr2).createRequest(addr1.address, {value: price});
                await requestsContract.connect(addrs[0]).createRequest(addr1.address, {value: price});
                await requestsContract.connect(addrs[1]).createRequest(addr1.address, {value: price});

                expect(await requestsContract.getBalance()).to.equal(ethers.utils.parseEther('6'));
                expect(await requestsContract.getTotalSupply()).to.equal(3);
            });
        
        });

        describe("Delete Request", function() {

            it("Should be able to delete a request when locking period expired", async function () {
                responseTime = 0;
                
                await celebrityContract.connect(addr1).createCelebrity(name, price, responseTime);
                await requestsContract.connect(addr2).createRequest(addr1.address, {value: price});
                expect(await requestsContract.getBalance()).to.equal(price);
                expect(await requestsContract.getNumberOfPendingRequests()).to.equal(1);

                await requestsContract.connect(addr2).deleteRequest(0);
                expect(await requestsContract.getBalance()).to.equal(0);
                expect(await requestsContract.getNumberOfPendingRequests()).to.equal(0);
                expect(await requestsContract.getTotalSupply()).to.equal(1);
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

            it("Should return the payment when a request is deleted", async function () {
                const responseTime = 0;
                
                await celebrityContract.connect(addr1).createCelebrity(name, price, responseTime);
                await requestsContract.connect(addr2).createRequest(addr1.address, {value: price});
                const userBalance = await addr2.getBalance();

                await requestsContract.connect(addr2).deleteRequest(0);
                expect(await requestsContract.getBalance()).to.equal(0);
                expect(await addr2.getBalance()).to.be.above(userBalance);
            });

        });

        describe("Sign Request", function() {

            it("Should be able to sign a request", async function () { 
                const responseTime = 0;
                const celebBalance = await addr1.getBalance();

                await celebrityContract.connect(addr1).createCelebrity(name, price, responseTime);
                await requestsContract.connect(addr2).createRequest(addr1.address, {value: price});
                expect(await requestsContract.getBalance()).to.equal(price);
                expect(await requestsContract.getTotalSupply()).to.equal(1);

                await requestsContract.connect(addr1).signRequest(0, hash, metadata);
                expect(await requestsContract.getBalance()).to.equal(0);
                expect(await addr1.getBalance()).to.be.above(celebBalance);
                expect(await requestsContract.getNumberOfPendingRequests()).to.equal(0);
                expect(await requestsContract.getTotalSupply()).to.equal(1);
            });

            it("Shouldn't be able to sign a request if sender is not the recipient", async function () {    
                const responseTime = 0;
                
                await celebrityContract.connect(addr1).createCelebrity(name, price, responseTime);
                await requestsContract.connect(addr2).createRequest(addr1.address, {value: price});

                await expect(
                    requestsContract.connect(addrs[0]).signRequest(0, hash, metadata)
                ).to.be.revertedWith('You are not the recipient of the request');
            });

            it("Should send fees to owner when signing a request", async function () {
                const feePercent = await requestsContract.connect(owner).getFeePercent();
                const fee = price * feePercent / 100;
                const ownerBalance = await owner.getBalance();
                const celebBalance = await addr1.getBalance();

                await celebrityContract.connect(addr1).createCelebrity(name, price, responseTime);
                await requestsContract.connect(addr2).createRequest(addr1.address, {value: price});                
                await requestsContract.connect(addr1).signRequest(0, hash, metadata);
                
                const expectedOwnerBalance = BigNumber(ownerBalance.toString()).plus(fee);
                const currentOwnerBalance = await owner.getBalance();
                expect(BigNumber(currentOwnerBalance.toString()).toString()).to.equal(expectedOwnerBalance.toString());
                expect(await addr1.getBalance()).to.be.above(celebBalance);
            });

            it("Shouldn't be able to sign a request that doesn't exist", async function () {    
                const responseTime = 0;
                
                await celebrityContract.connect(addr1).createCelebrity(name, price, responseTime);
                await requestsContract.connect(addr2).createRequest(addr1.address, {value: price});
                await requestsContract.connect(addr2).deleteRequest(0);

                await expect(
                    requestsContract.connect(addr1).signRequest(0, hash, metadata)
                ).to.be.reverted;
            });

        });

    });

    describe("Autograph Contract", function() {

        it("Should mint a correct NFT after signing a request", async function () {
            const responseTime = 0;

            await celebrityContract.connect(addr1).createCelebrity(name, price, responseTime);
            await requestsContract.connect(addr2).createRequest(addr1.address, {value: price});
            await requestsContract.connect(addr1).signRequest(0, hash, metadata);

            expect(await autographContract.totalSupply()).to.equal(1);
            expect(await autographContract.ownerOf(1)).to.equal(addr2.address);
            expect(await autographContract.balanceOf(addr2.address)).to.equal(1);
        });

        it("Should transfer a token between accounts", async function () {
            const responseTime = 0;

            await celebrityContract.connect(addr1).createCelebrity(name, price, responseTime);
            await requestsContract.connect(addr2).createRequest(addr1.address, {value: price});
            await requestsContract.connect(addr1).signRequest(0, hash, metadata);

            await autographContract.connect(addr2).approve(addrs[0].address, 1);
            await autographContract.connect(addrs[0]).transferFrom(addr2.address, addrs[0].address, 1);

            expect(await autographContract.totalSupply()).to.equal(1);
            expect(await autographContract.ownerOf(1)).not.equal(addr2.address);
            expect(await autographContract.ownerOf(1)).to.equal(addrs[0].address);
            expect(await autographContract.balanceOf(addr2.address)).to.equal(0);
            expect(await autographContract.balanceOf(addrs[0].address)).to.equal(1);
        });

    });

});