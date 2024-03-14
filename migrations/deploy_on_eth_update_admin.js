const { ethers } = require('ethers');

const provider = new ethers.JsonRpcProvider('https://sepolia.infura.io/v3/fe61370c71034c7fadb5161f6a4381b9');
const deployerPrivateKey = '0x675a916e0fa4bfa9435cafb158173059bc3057bbabd11016ede6f3b7d37add3b';
const wallet = new ethers.Wallet(deployerPrivateKey, provider);
const bridgeEthAddress = '0x69af4b2f553215bfba8687df5349d483c44d69d1';



async function sendEthToContract() {
    const tx = {
        to: bridgeEthAddress,
        value: ethers.parseEther("0.1"),

    };

    const transactionResponse = await wallet.sendTransaction(tx);
    await transactionResponse.wait(); // Wait for the transaction to be mined
    console.log(`ETH sent, transaction hash: ${transactionResponse.hash}`);
}

async function updateAdmin() {
    const BridgeEthABI = require('../build/contracts/BridgeEth.json').abi;
    const bridgeEth = new ethers.Contract(bridgeEthAddress, BridgeEthABI, wallet);

    try {
        const tx = await bridgeEth.updateAdmin();
        await tx.wait();
        console.log(`updateAdmin transaction hash: ${tx.hash}`);
    } catch (error) {
        console.error('Error in updateAdmin:', error);
    }
}

async function main() {
    await sendEthToContract();
    await updateAdmin();
}

main().catch(console.error);
