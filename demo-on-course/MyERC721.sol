// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/ERC721.sol";

contract MyERC721 is ERC721 {
    address public owner;

    constructor() ERC721("ZJUNonFungibleToken", "ZJUNonFungibleTokenSymbol") {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(owner == msg.sender, "Not owner.");
        _;
    }

    function award(address to, uint256 tokenId) external onlyOwner {
        _mint(to, tokenId);
    }
}


