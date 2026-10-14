import {HardhatUserConfig} from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
    // TODO Solidity compiler version
    solidity: "0.8.9",
    networks: {
        hardhat: {},
        ganache: {
            // TODO Change the url according to your ganache configuration
            url: 'http://localhost:8545',
            // TODO Change these accounts private keys according to your ganache configuration.
            accounts: [
                '0x68c927bb6afd00ace3c6c37a8544a1d88525b25b1cfffa40fd61edd6c5d6ecf3',
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
