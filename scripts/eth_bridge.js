const ethers = require('ethers');

const ethProvider = new ethers.WebSocketProvider('wss://polygon-mumbai.infura.io/ws/v3/fe61370c71034c7fadb5161f6a4381b9');
const ethBridgeContractABI = require('../build/contracts/BridgeEth.json').abi;
const ethBridgeContractAddress = '0x367Fa6E0a8092E4255F2DBc565d0598998D45247';
const ethBridgeContract = new ethers.Contract(ethBridgeContractAddress, ethBridgeContractABI, ethProvider);
const deployerPrivateKey = '0x675a916e0fa4bfa9435cafb158173059bc3057bbabd11016ede6f3b7d37add3b';
const ethSigner = new ethers.Wallet(deployerPrivateKey).connect(ethProvider);

const tntProvider = new ethers.JsonRpcProvider('https://eth-rpc-api-testnet.thetatoken.org/rpc');
const tntBridgeContractABI = require('../build/contracts/BridgeTnt.json').abi;
const tntBridgeContractAddress = '0xEe285da7c361Da4D1486b570322FB273A6304a19';
const tntSigner = new ethers.Wallet(deployerPrivateKey).connect(tntProvider);
const BridgeTnt = new ethers.Contract(tntBridgeContractAddress, tntBridgeContractABI, tntSigner);

console.log("Listening to Transfer events on MATIC...");
ethBridgeContract.on("Transfer", async (from, to, amount, nonce, signature, event) => {
  console.log(`Transfer event detected: from ${from} to ${to}, value: ${amount}`);
  console.log('Event details:', event);

  try {
    const fromAddress = tntBridgeContractAddress; // Assuming this is authorized to mint
    const toAddress = tntBridgeContractAddress; 

    const abiCoder = ethers.AbiCoder.defaultAbiCoder();
    const types = ['address', 'address', 'uint256', 'uint256'];
    const values = [fromAddress, toAddress, amount, nonce];
    const encodedData = abiCoder.encode(types, values);
    const messageHash = ethers.keccak256(encodedData);
    const signatureMint = await tntSigner.signMessage(messageHash);

    const mintTx = await BridgeTnt.mint(fromAddress, toAddress, amount, nonce, signatureMint);
    await mintTx.wait();
    console.log(mintTx)

    const transferTx = await BridgeTnt.transferReplayToken(to, amount);
    await transferTx.wait();
    console.log(transferTx)
  } catch (error) {
    console.error("Error executing mint:", error);
  }
});
