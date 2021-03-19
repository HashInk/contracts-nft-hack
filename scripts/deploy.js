async function main() {

    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account => ", deployer.address);

    console.log("Account balance => ", (await deployer.getBalance()).toString()); 

    CelebrityContract = await ethers.getContractFactory("CelebrityContract");
    celebrityContract = await CelebrityContract.deploy();
    console.log("CelebrityContract address => ", celebrityContract.address);

    AutographContract = await ethers.getContractFactory("AutographContract");
    autographContract = await AutographContract.deploy();
    console.log("AutographContract address => ", autographContract.address);

    AutographRequestContract = await ethers.getContractFactory("AutographRequestContract");
    requestsContract = await AutographRequestContract.deploy(celebrityContract.address, autographContract.address);
    console.log("AutographRequestContract address => ", requestsContract.address);

}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
