// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.19;

interface IToken {
    function mint(address to, uint amount) external;
    function transfer(address to, uint amount) external;
    function updateAdmin() external;

    // Add allowance method to check the amount of tokens that an owner allowed to a spender.
    function allowance(address owner, address spender) external view returns (uint);

    // Add transferFrom method to transfer tokens from one address to another.
    function transferFrom(address from, address to, uint amount) external returns (bool);
}
