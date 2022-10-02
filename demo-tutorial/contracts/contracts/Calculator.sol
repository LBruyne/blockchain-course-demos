// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract Calculator {

    event UserAddressHash(bytes32 hash);

    function sum(uint256 a, uint256 b) pure external returns (uint256 c) {
    unchecked {c = a + b;}
    }

    function safeSumUint8(uint8 a, uint8 b) pure external returns (uint8 c) {
    unchecked {c = a + b;}
    }

    function unsafeSumUint8(uint8 a, uint8 b) pure external returns (uint8 c) {
        c = a + b;
    }

    function multiply(uint256 a, uint256 b) pure external returns (uint256 c) {
    unchecked {c = a * b;}
    }

    function getUserAddressHash() external returns (bytes32) {
        // console.log(msg.sender);
        bytes32 hash = keccak256(abi.encodePacked(msg.sender));
        emit UserAddressHash(hash);
        return hash;
    }

}
