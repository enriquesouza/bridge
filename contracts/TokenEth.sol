pragma solidity 0.8.24;

import "./TokenBase.sol";

contract TokenEth is TokenBase {
    constructor() TokenBase("ETH Token", "ETK") {}
}
