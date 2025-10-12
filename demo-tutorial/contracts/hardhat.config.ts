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
                '0xf3fd6946cb91eb6e948fb34f261620850eb4d2d12a60a8dab7264a15e252621f',
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
