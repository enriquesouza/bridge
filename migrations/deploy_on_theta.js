const { ethers } = require('ethers');

const provider = new ethers.JsonRpcProvider('https://eth-rpc-api-testnet.thetatoken.org/rpc');
const deployerPrivateKey = '0x675a916e0fa4bfa9435cafb158173059bc3057bbabd11016ede6f3b7d37add3b';
const wallet = new ethers.Wallet(deployerPrivateKey, provider);

const ReplayTokenABI = require('../build/contracts/ReplayToken.json').abi;
const ReplayTokenBytecode = require('../build/contracts/ReplayToken.json').bytecode;
const BridgeTntABI = require('../build/contracts/BridgeTnt.json').abi;
const BridgeTntBytecode = require('../build/contracts/BridgeTnt.json').bytecode;

async function deployContract(contractABI, contractBytecode, constructorArgs = []) {
    const factory = new ethers.ContractFactory(contractABI, contractBytecode, wallet);
    const contract = await factory.deploy(...constructorArgs);
    await contract.waitForDeployment()
    await contract.getAddress()
    console.log('Contract deployed to:', contract.target);
    return contract;
}

async function main() {
    const replayToken = await deployContract(ReplayTokenABI, ReplayTokenBytecode, [
        "ReplayToken", "RPT", 18,
        ethers.parseUnits("1000000", 18), // Max supply
        wallet.address, // Minter as deployer
        ethers.parseUnits("100", 0), // Staker reward per block
        wallet.address, // Initial distribution to deployer
        ethers.parseUnits("500000", 18), // Initial mint amount
        wallet.address // Temporary admin, to be updated later
    ]);

    const bridgeTnt = await deployContract(BridgeTntABI, BridgeTntBytecode, [replayToken.target]);
    await bridgeTnt.waitForDeployment()
    await replayToken.setPendingAdmin(bridgeTnt.target);
    await replayToken.waitForDeployment()
}

main().catch(console.error);
