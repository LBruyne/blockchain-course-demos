import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  // Solidity compiler version
  solidity: "0.8.9",
  networks: {
    ganache: {
      // Change the url according to your ganache configuration
      url: 'http://localhost:8545',
      // Change these accounts private keys according to your ganache configuration.
      accounts: [
        'f3fd6946cb91eb6e948fb34f261620850eb4d2d12a60a8dab7264a15e252621f',
        'eaf0b6087ea636316b373d74dbee20dd1ebaf90e483d88e967d7b6bcd5dff5d9',
        '845254a4f6f3c93cbe4c9d2d0a927230f33e991bb145eba9f9e197bc765039e1',
      ]
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
};

export default config;
