// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import './Demo.sol';








contract Demo2 {

    // msg.sender
    function msgSender() view external {
        // 这里的msg.sender是调用transfer方法的人
        require(msg.sender == internalMsgSender(), "exception1");
    }
    function internalMsgSender() view internal returns(address) {
        // 这里的msg.sender仍然是调用transfer方法的人
        return msg.sender;
    }
    function crossContractMsgSender(address demo) view external returns(address) {
        // 跨合约调用时，被调用合约中的msg.sender是发出调用的合约
        require(address(this) == Demo(demo).crossContractReceiver(), "exception2");
        return msg.sender;
    }

    // function register(string calldata ) payable external {
    //     return;
    // }

    fallback() external {

    }
}