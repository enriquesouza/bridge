const ethers = require('ethers')

const Web3 = require('web3')
const web3 = new Web3('https://eth-rpc-api-testnet.thetatoken.org/rpc')

// #START TNT
const tntProvider = new ethers.JsonRpcProvider('https://eth-rpc-api-testnet.thetatoken.org/rpc');
const tntBridgeContractABI = require('../build/contracts/BridgeTnt.json').abi;
const tntBridgeContractAddress = '0xEe285da7c361Da4D1486b570322FB273A6304a19'
const deployerPrivateKey = '0x675a916e0fa4bfa9435cafb158173059bc3057bbabd11016ede6f3b7d37add3b';
const tntSigner = new ethers.Wallet(deployerPrivateKey).connect(tntProvider);
const tntBridgeContract = new ethers.Contract(tntBridgeContractAddress, tntBridgeContractABI, tntSigner);
// #END TNT

// #START ETH
const ethProvider = new ethers.WebSocketProvider('wss://polygon-mumbai.infura.io/ws/v3/fe61370c71034c7fadb5161f6a4381b9');
const ethBridgeContractABI = require('../build/contracts/BridgeEth.json').abi;
const ethBridgeContractAddress = '0x367Fa6E0a8092E4255F2DBc565d0598998D45247';
const ethSigner = new ethers.Wallet(deployerPrivateKey).connect(ethProvider);
const BridgeEth = new ethers.Contract(ethBridgeContractAddress, ethBridgeContractABI, ethSigner);
// #END ETH

//TODO: the problem here is that we will need an external DB to control the blocks
console.log("Listening events on THETA...");
async function getPastEvents(contract, fromBlock) {
  const eventName = "Transfer";
  const eventFilter = contract.filters[eventName]();
  const events = await contract.queryFilter(eventFilter, fromBlock, 'latest');

  for (let event of events) {

    const { from, to, amount, nonce } = event.args;

    try {
      const fromAddress = ethBridgeContractAddress; // Assuming this is authorized to mint
      const toAddress = ethBridgeContractAddress;

      const abiCoder = ethers.AbiCoder.defaultAbiCoder();
      const types = ['address', 'address', 'uint256', 'uint256'];
      const values = [fromAddress, toAddress, amount, nonce];
      const encodedData = abiCoder.encode(types, values);
      const messageHash = ethers.keccak256(encodedData);
      const signatureMint = await ethSigner.signMessage(messageHash);

      const mintTx = await BridgeEth.mint(fromAddress, toAddress, amount, nonce, signatureMint);
      await mintTx.wait();
      console.log(mintTx)

      const transferTx = await BridgeEth.transferReplayToken(to, amount);
      await transferTx.wait();
      console.log(transferTx)
    } catch (error) {
      console.error("Error executing mint:", error);
    }

  }

  console.log(events); // Logs the fetched events
  return events.length ? events[events.length - 1].blockNumber : fromBlock;
}

async function getCurrentBlock() {
  return tntProvider.getBlockNumber();
}

let fromBlock;

// 25452084 > that is the block we burned the token
async function setupEventFetching() {
  fromBlock = 25452084//await getCurrentBlock();
  console.log(`Starting from block ${fromBlock}`);

  setInterval(async () => {
    try {
      const newFromBlock = await getPastEvents(tntBridgeContract, fromBlock + 1);
      if (newFromBlock > fromBlock) {
        fromBlock = newFromBlock + 1; // Prepare for the next interval to start from the next block
        console.log(`Updated fromBlock to ${fromBlock}`);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  }, 10000); // Adjust the interval as needed
}

setupEventFetching();