const { ethers } = require('ethers');

const provider = new ethers.JsonRpcProvider('https://polygon-mumbai.infura.io/v3/fe61370c71034c7fadb5161f6a4381b9');
const deployerPrivateKey = '0x675a916e0fa4bfa9435cafb158173059bc3057bbabd11016ede6f3b7d37add3b';
const wallet = new ethers.Wallet(deployerPrivateKey, provider);

const ReplayTokenABI = require('../build/contracts/ReplayToken.json').abi;
const ReplayTokenBytecode = require('../build/contracts/ReplayToken.json').bytecode;
const BridgeEthABI = require('../build/contracts/BridgeEth.json').abi;
const BridgeEthBytecode = require('../build/contracts/BridgeEth.json').bytecode;

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

    const bridgeEth = await deployContract(BridgeEthABI, BridgeEthBytecode, [replayToken.target]);
    await bridgeEth.waitForDeployment()
    // Set the pending admin of the token
    await replayToken.setPendingAdmin(bridgeEth.target);
    await replayToken.waitForDeployment()
    // Update the admin so the bridge can mint tokens
    await sendEthToContract(bridgeEth.target);
    await updateAdmin(bridgeEth.target);
}

async function sendEthToContract(bridgeEthAddress) {
    const tx = {
        to: bridgeEthAddress,
        value: ethers.parseEther("0.1"),

    };

    const transactionResponse = await wallet.sendTransaction(tx);
    await transactionResponse.wait(); // Wait for the transaction to be mined
    console.log(`ETH sent, transaction hash: ${transactionResponse.hash}`);
}

async function updateAdmin(bridgeEthAddress) {
    const bridgeEth = new ethers.Contract(bridgeEthAddress, BridgeEthABI, wallet);
    try {
        const tx = await bridgeEth.updateAdmin();
        await tx.wait();
        console.log(`updateAdmin transaction hash: ${tx.hash}`);
    } catch (error) {
        console.error('Error in updateAdmin:', error);
    }
}

main().catch(console.error);

//await tokenInstance.setPendingAdmin(pendingAdmin, { from: admin });
// await tokenInstance.updateAdmin({ from: pendingAdmin });
// const updatedAdmin = await tokenInstance.admin();
// npx hardhat verify --network sepolia 0x764E75692baC03D8420Ce52E28cC926E103f8eC1 "ReplayToken" "RPT" 18 "1000000000000000000000000" "0x2dfFF737EB054DED9795d96d6d9B9909896BB940" "100" "0x2dfFF737EB054DED9795d96d6d9B9909896BB940" "500000000000000000000000" "0x2dfFF737EB054DED9795d96d6d9B9909896BB940"
// npx hardhat verify --constructor-args constructor.js 0x764E75692baC03D8420Ce52E28cC926E103f8eC1