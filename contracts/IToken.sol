// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.19;

interface IToken {
    function mint(uint256 amount) external;
    function transfer(address to, uint amount) external;
    function updateAdmin() external;
    function allowance(address owner, address spender) external view returns (uint);
    function transferFrom(address from, address to, uint amount) external returns (bool);
    function balanceOf(address account) external view returns (uint);
}
