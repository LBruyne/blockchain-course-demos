import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Calculator", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployContractFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const Calculator = await ethers.getContractFactory("Calculator");
    const calculator = await Calculator.deploy();
    await calculator.deployed();
    return { Calculator, calculator, owner, otherAccount };
  }

  describe("Test functions", function () {
    it("sum", async function () {
      const { calculator } = await loadFixture(deployContractFixture);
      expect(await calculator.sum(10, 20)).to.equal(30);
    });

    it("safe uint8 sum", async function () {
      const { calculator } = await loadFixture(deployContractFixture);
      expect(await calculator.safeSumUint8(255, 5)).to.equal(4);
    });

    it("unsafe int8 sum", async function () {
      const { calculator } = await loadFixture(deployContractFixture);
      await expect(calculator.unsafeSumUint8(255, 5)).to.be.reverted
    });

    it("multiply", async function () {
      const { calculator } = await loadFixture(deployContractFixture);
      expect(await calculator.multiply(4, 5)).to.equal(20);
    });


    it("get user address hash", async function () {
      const { calculator, owner } = await loadFixture(deployContractFixture);
      const userAddress = owner.address;
      console.log("sender address:", userAddress);
      const expectedHash = ethers.utils.solidityKeccak256(["address"], [userAddress])
      // test event
      await expect(calculator.connect(owner).getUserAddressHash())
          .to.emit(calculator, 'UserAddressHash')
          .withArgs(expectedHash);
      // test result
      expect(await calculator.connect(owner).callStatic.getUserAddressHash()).to.equal(expectedHash);
    });
  });
});
