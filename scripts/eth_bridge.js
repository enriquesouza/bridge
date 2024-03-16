const ethers = require('ethers')
const ethProvider = new ethers.WebSocketProvider('wss://polygon-mumbai.infura.io/ws/v3/fe61370c71034c7fadb5161f6a4381b9');
const ethBridgeContractABI = require('../build/contracts/BridgeEth.json').abi;
const ethBridgeContractAddress = '0x7eBf9fCaC5FDe523c3Be67cF1b30b11F8a9C1571'
const ethBridgeContract = new ethers.Contract(ethBridgeContractAddress, ethBridgeContractABI, ethProvider);

console.log("Listening to Transfer events on MATIC...")
ethBridgeContract.on("Transfer", (from, to, value, event) => {
  console.log(`Transfer event detected: from ${from} to ${to}, value: ${value}`);
  console.log('Event details:', event);
});

