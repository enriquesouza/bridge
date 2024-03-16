const ethers = require('ethers')
const tntProvider = new ethers.WebSocketProvider('wss://eth-rpc-api-testnet.thetatoken.org:18889/rpc');
const tntBridgeContractABI = require('../build/contracts/BridgeTnt.json').abi;
const tntBridgeContractAddress = '0x2a52C76d3D8e93aE6C152125185fdE5f41F28585'
const tntBridgeContract = new ethers.Contract(tntBridgeContractAddress, tntBridgeContractABI, tntProvider);

console.log("Listening to Transfer events on THETA...")
tntBridgeContract.on("Transfer", (from, to, value, event) => {
  console.log(`Transfer event detected: from ${from} to ${to}, value: ${value}`);
  console.log('Event details:', event);
});

