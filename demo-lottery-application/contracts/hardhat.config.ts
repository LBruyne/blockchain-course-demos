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
        'e7b3551781108825f89f9bcfc50d03c61f3e8f0169494b6b4ae8594e74a5d3ec',
        '4b2f81d42c979d50b3019bc3a8ca1524b4342c00912db8c3dda08db78c3fd390',
        'a656b929893a0133cced4f942670f7263b7a229d5a887bec25358acb99a951d5',
        'c037f223098073b66d6fc1d67c258e9c800b74d14fa600a6baf8c02178ff5d16',
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
