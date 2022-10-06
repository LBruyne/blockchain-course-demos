// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./MyERC20.sol";

contract Lottery {

    uint256 constant public PLAY_AMOUNT = 500;

    uint256 public totalAmount; // 奖池总共金额
    address public manager; // 管理员，用来开奖和退款

    address[] public players; // 玩家

    address public winner; // 胜者
    MyERC20 public myERC20; // 彩票相关的代币合约

    modifier onlyManager {
        require(msg.sender == manager);
        _;
    }

    // 管理员
    constructor() {
        myERC20 = new MyERC20("ZJUToken", "ZJUTokenSymbol");
        manager = msg.sender;
    }

    // 获取参与者数量
    function getPlayerNumber() view external returns (uint256){
        return players.length;
    }

    // 投注
    function play() public {
        // 委托转账操作
        myERC20.transferFrom(msg.sender, address(this), PLAY_AMOUNT);
        // 把参与者加入到彩票池中
        players.push(msg.sender);

        totalAmount += PLAY_AMOUNT;
    }

    // 从参与玩家中随机抽取一个玩家，这里使用哈希算法来随机：Hash(当前时间，区块的挖矿难度，彩民数量)
    function draw() onlyManager public {
        require(players.length != 0, "No player involved in the game");
        bytes32 hash = keccak256(abi.encodePacked(block.timestamp, block.difficulty, players.length));
        uint256 hashValue = uint256(hash);

        // 随机找到一个玩家
        uint256 index = hashValue % players.length;
        winner = players[index];

        // 将本合约的所有Token转让给赢家
        myERC20.transfer(winner, myERC20.balanceOf(address(this)));
        // 清理彩民池
        delete players;
        totalAmount = 0;
    }

    // 退奖
    function refund() onlyManager public {
        // 依次给参与玩家退款
        for(uint256 i = 0; i < players.length; i++){
            myERC20.transfer(players[i], PLAY_AMOUNT);
        }
        // 清理彩民池
        delete players;
        totalAmount = 0;
    }
}
