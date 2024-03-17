const ethers = require('ethers');
const Web3 = require('web3');

const ethProvider = new ethers.WebSocketProvider('wss://polygon-mumbai.infura.io/ws/v3/fe61370c71034c7fadb5161f6a4381b9');
const ethBridgeContractABI = require('../build/contracts/BridgeEth.json').abi;
const ethBridgeContractAddress = '0x443a0232E358A58245ad39475769b5060301ffc2';
const ethBridgeContract = new ethers.Contract(ethBridgeContractAddress, ethBridgeContractABI, ethProvider);
const deployerPrivateKey = '0x675a916e0fa4bfa9435cafb158173059bc3057bbabd11016ede6f3b7d37add3b';
const ethSigner = new ethers.Wallet(deployerPrivateKey).connect(ethProvider);

const tntProvider = new ethers.JsonRpcProvider('https://eth-rpc-api-testnet.thetatoken.org/rpc');
const tntBridgeContractABI = require('../build/contracts/BridgeTnt.json').abi;
const tntBridgeContractAddress = '0x52CC37b819868713D8ed7514BF6075d71e78E6dE';
const tntSigner = new ethers.Wallet(deployerPrivateKey).connect(tntProvider);
const BridgeTnt = new ethers.Contract(tntBridgeContractAddress, tntBridgeContractABI, tntSigner);

const web3Tnt = new Web3('https://eth-rpc-api-testnet.thetatoken.org/rpc');
// // Theta Private Network
const web3TntContract = new web3Tnt.eth.Contract(
  tntBridgeContractABI,
  tntBridgeContractAddress
);

// console.log("Listening to Transfer events on MATIC...");
// ethBridgeContract.on("Transfer", async (from, to, amount, nonce, signature, event) => {
//   console.log(`Transfer event detected: from ${from} to ${to}, value: ${amount}`);
//   console.log('Event details:', event);

//   try {

//     const fromAddress = tntBridgeContractAddress // The mint comes from the contract
//     const toAddress = "0x2dfFF737EB054DED9795d96d6d9B9909896BB940"; // 

//     const abiCoder = ethers.AbiCoder.defaultAbiCoder()
//     const types = ['address', 'address', 'uint256', 'uint256'];
//     const values = [fromAddress, toAddress, amount, nonce];
//     const encodedData = abiCoder.encode(types, values);
//     const messageHash = ethers.keccak256(encodedData);
//     const signatureMint = await ethSigner.signMessage(messageHash);

//     const web3TntMintTx = await web3TntContract.methods.mint(from, to, amount, nonce, signatureMint);
//     const gasCost = await web3TntMintTx.estimateGas({ from: tntSigner.address })
//     const gasPrice = web3Tnt.eth.getGasPrice()
//     const data = web3TntMintTx.encodeABI();
//     const txData = {
//       from: tntSigner.address,
//       to: tntBridgeContractABI,
//       data,
//       gas: gasCost,
//       gasPrice
//     };
//     const receipt = await web3Tnt.eth.sendTransaction(txData);
    
//     console.log('Mint finished', receipt);
//   } catch (error) {
//     console.error("Error executing mint:", error);
//   }
// });

console.log("Listening to Transfer events on MATIC...");
ethBridgeContract.on("Transfer", async (from, to, amount, nonce, signature, event) => {
  console.log(`Transfer event detected: from ${from} to ${to}, value: ${amount}`);
  console.log('Event details:', event);

  try {
    const fromAddress = tntBridgeContractAddress; // Assuming this is authorized to mint
    const toAddress = "0x2dfFF737EB054DED9795d96d6d9B9909896BB940"; 

    const abiCoder = ethers.AbiCoder.defaultAbiCoder();
    const types = ['address', 'address', 'uint256', 'uint256'];
    const values = [fromAddress, toAddress, amount, nonce];
    const encodedData = abiCoder.encode(types, values);
    const messageHash = ethers.keccak256(encodedData);
    const signatureMint = await ethSigner.signMessage(messageHash);

    const web3TntMintTx = web3TntContract.methods.mint(fromAddress, toAddress, amount, nonce, signatureMint);
    const gasCost = await web3TntMintTx.estimateGas({ from: tntSigner.address });
    const gasPrice = await web3Tnt.eth.getGasPrice();
    const data = web3TntMintTx.encodeABI();
    const txData = {
      from: tntSigner.address,
      to: tntBridgeContractAddress,
      data,
      gas: gasCost,
      gasPrice
    };
    const receipt = await web3Tnt.eth.sendTransaction(txData);
    
    console.log('Mint finished', receipt);
  } catch (error) {
    console.error("Error executing mint:", error);
  }
});

