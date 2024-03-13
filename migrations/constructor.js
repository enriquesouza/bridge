const { ethers } = require('ethers');

module.exports =
    [
        "ReplayToken",
        "RPT",
        18,
        ethers.parseUnits("1000000", 18), // Max supply
        "0x2dfFF737EB054DED9795d96d6d9B9909896BB940", // Minter as deployer
        ethers.parseUnits("100", 0), // Staker reward per block
        "0x2dfFF737EB054DED9795d96d6d9B9909896BB940", // Initial distribution to deployer
        ethers.parseUnits("500000", 18), // Initial mint amount
        "0x2dfFF737EB054DED9795d96d6d9B9909896BB940" // Temporary admin, to be updated later
    ];