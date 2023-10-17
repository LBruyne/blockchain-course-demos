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
                '0x426a687e403df584ffa0123578be23aa22df7630be3cc836e1b27233a309f67f',
                '0xfb6ac705c6736aff3772c973534b100317822da23fadbd3601b9a5f897888721',
                '0x857c2ed5d2d31456668bef8748d1370310a573a2aa386b201ff3d92b4971f78a',
                '0x883c9d5be0244f6774539b1392aca0e040272584b2ceac286ccd9a01f730ea2e',
                '0xb13cc21621b9dcdf526aba5d6820140869be5f1ba7dfd53fe541e2784656cc51'
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
