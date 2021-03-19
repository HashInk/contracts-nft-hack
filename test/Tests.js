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

    beforeEach(async function () {
    
        // Deploying celebrities contract
        CelebrityContract = await ethers.getContractFactory("CelebrityContract");
        celebrityContract = await CelebrityContract.deploy();
        expect(celebrityContract.address).to.properAddress;

        // Getting tests accounts
        [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    });

    describe("Celebrity Contract", function() {

        it("Should create a new celebrity", async function () { 
            const name = "Justin Shenkarow";
            const price = ethers.utils.parseEther('2');
            const responseTime = 2;

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
            const name = "Justin Shenkarow";
            const price = ethers.utils.parseEther('2');
            const responseTime = 2;

            await celebrityContract.connect(addr1).createCelebrity(
                "Vitalik Buterin", ethers.utils.parseEther('1'), 4);                
            await celebrityContract.connect(addr1).createCelebrity(name, price, responseTime);
            
            const celeb = await celebrityContract.getCelebrity(addr1.address);
            expect(celeb[0]).to.equal(name);
            expect(celeb[1]).to.equal(price);
            expect(celeb[2]).to.equal(responseTime);
        });
    
    });

});