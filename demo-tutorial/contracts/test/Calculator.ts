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
      // keccak256hash(f39fd6e51aad88f6f4ce6ab8827279cfffb92266)
      expect(await calculator.connect(owner).getUserAddressHash()).to.equal('0xe9707d0e6171f728f7473c24cc0432a9b07eaaf1efed6a137a4a8c12c79552d9');
    });
  });
});
