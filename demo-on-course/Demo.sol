// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

contract Demo {

    constructor() payable {
        demoImmutableValue = 10;
    }

    // 结构体
    struct Funder {
        address addr;
        uint amount;
    }

    // 变量初值
    uint constant demoConstant = 10;
    uint immutable demoImmutableValue;
    uint public demoStateValue = 5;

    // 多个返回值
    uint index;
    function f() public pure returns (uint, bool, uint) {
        return (7, true, 2);
    }
    function g() public {
        // Variables declared with type and assigned from the returned tuple,
        // not all elements have to be specified (but the number must match).
        (uint x, , uint y) = f();
        // Common trick to swap values -- does not work for non-value storage types.
        (x, y) = (y, x);
        // Components can be left out (also for variable declarations).
        (index, , ) = f(); // Sets the index to 7
    }

    // 返回值可以被预先声明
    function getThreeNum() pure public returns(uint one,uint two, uint three){
        one = 1;
        two = 2;
        three = 3;
    }

    // 跨合约调用 
    // 部署Demo2.sol，获取地址，作为目标
    function crossContractCall(address someAddress) public {
        address contractAddress = address(someAddress);
        // Call: 调用合约的函数，并附加一些gas或者value
        (bool success1, ) = contractAddress.call{gas: 1000000}(abi.encodeWithSignature("register(string)", "MyName"));
        (bool success2, ) = contractAddress.call{value: 1 ether}(abi.encodeWithSignature("register(string)", "MyName"));
        // DelegateCall: 调用合约的函数，但是改变自己的storage
        (bool success3, ) = contractAddress.delegatecall(abi.encodeWithSignature("register(string)", "MyName"));
        require(success1 == true, "cross contract 1 failed.");
        require(success2 == true, "cross contract 2 failed.");
        require(success3 == true, "cross contract 3 failed.");
    }
    function crossContractReceiver() view public returns(address)  {
        // 跨合约调用时，被调用合约中的msg.sender是发出调用的合约
        return msg.sender;
    }


    // 函数修饰符modifier
    address public someone = address(0x123456);
    modifier onlySomeone() {
        require(msg.sender == someone, "This is not someone");
        _;
    }
    function thisFunctionCanOnlyBeInvokedByASpecifiedUser() view public onlySomeone returns(uint) {
        return 10;
    }


    // 结构体示例
    // Structs can also be defined inside contracts, which makes them
    // visible only there and in derived contracts.
    struct Campaign {
        address payable beneficiary;
        uint fundingGoal;
        uint numFunders;
        uint amount;
        mapping (uint => Funder) funders;
    }
    mapping (uint => Campaign) campaigns;
    function contribute(uint campaignID) public payable {
        Campaign storage c = campaigns[campaignID];
        // Creates a new temporary memory struct, initialised with the given values
        // and copies it over to storage.
        // Note that you can also use Funder(msg.sender, msg.value) to initialise.
        c.funders[c.numFunders++] = Funder({addr: msg.sender, amount: msg.value});
        c.amount += msg.value;
    }


    // EVENT
    event Deposit(
        address indexed from,
        bytes32 indexed id,
        uint value
    );
    function deposit(bytes32 id) public payable {
        // Events are emitted using `emit`, followed by
        // the name of the event and the arguments
        // (if any) in parentheses. Any such invocation
        // (even deeply nested) can be detected from
        // the JavaScript API by filtering for `Deposit`.
        emit Deposit(msg.sender, id, msg.value);
    }

}