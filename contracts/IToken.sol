// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.19;

interface IToken {
    function mint(address to, uint amount) external;

    function transfer(address to, uint amount) external;
}
