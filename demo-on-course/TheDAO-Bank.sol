// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract Bank {
    mapping (address => uint256) balance;

    constructor() payable {

    }

    function balanceOf(address user) view external returns(uint256) {
        return balance[user];
    }

    function deposit() external payable {
        balance[msg.sender] += msg.value;
    }

    function withdraw() external {
        uint256 amount = balance[msg.sender];
        (bool success, ) = msg.sender.call{ value: amount * 1 wei }("");
        if(!success) {
            revert("withdraw failed");
        }
        balance[msg.sender] = 0;
    }
}