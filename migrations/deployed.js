const { ethers } = require('ethers');

// Set up provider (you can also use other networks/providers)
const provider = new ethers.JsonRpcProvider('https://sepolia.infura.io/v3/fe61370c71034c7fadb5161f6a4381b9');

// Your contract's ABI and address
const contractABI = require('../build/contracts/ReplayToken.json').abi;
const contractAddress = '0x764E75692baC03D8420Ce52E28cC926E103f8eC1';

// The wallet signing the transaction (replace with your private key and ensure it's secure)
const signer = new ethers.Wallet('0x675a916e0fa4bfa9435cafb158173059bc3057bbabd11016ede6f3b7d37add3b', provider);

// Create a contract instance
const contract = new ethers.Contract(contractAddress, contractABI, signer);

async function callMyFunction() {
    // Example call: replace `myFunction` with your contract function
    // For non-transactional (view) functions, use `.call()`
    // For transactional functions, just call them directly and wait for the transaction receipt
    try {
        // If `myFunction` is a view/pure function
        //const result = await contract.myFunction(); // Add parameters inside `()` if needed
        console.log('Function result:', JSON.stringify(contract));

        // If `myFunction` changes state, uncomment the following lines
        // const tx = await contract.myFunction(); // Add parameters inside `()` if needed
        // await tx.wait();
        // console.log('Transaction completed');
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

callMyFunction();
