// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol";

contract MyERC20 is ERC20 {
    constructor() ERC20("ZJUToken", "ZJUTokenSymbol") {
        _mint(msg.sender, 100000000000000000000);
    }
}


