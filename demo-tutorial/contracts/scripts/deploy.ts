import {ethers} from "hardhat";

async function main() {
    const Calculator = await ethers.getContractFactory("Calculator");
    const calculator = await Calculator.deploy();
    await calculator.deployed();
    console.log(`contract Calculator deployed to ${calculator.address}`);

    const [owner, otherAccount] = await ethers.getSigners();
    const ownerAddress = owner.address;
    console.log("Expected hash:", ethers.utils.solidityKeccak256(["address"], [ownerAddress]));
    const simulatedHash = await calculator.callStatic.getUserAddressHash();
    console.log("Simulated User Address Hash:", simulatedHash);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
