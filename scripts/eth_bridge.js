const ethers = require('ethers')
const ethProvider = new ethers.WebSocketProvider('wss://polygon-mumbai.infura.io/ws/v3/fe61370c71034c7fadb5161f6a4381b9');
const ethBridgeContractABI = require('../build/contracts/BridgeEth.json').abi;
const ethBridgeContractAddress = '0x443a0232E358A58245ad39475769b5060301ffc2'
const ethBridgeContract = new ethers.Contract(ethBridgeContractAddress, ethBridgeContractABI, ethProvider);
const deployerPrivateKey = '0x675a916e0fa4bfa9435cafb158173059bc3057bbabd11016ede6f3b7d37add3b';
const wallet = new ethers.Wallet(deployerPrivateKey, ethProvider);

console.log("Listening to Transfer events on MATIC...")
ethBridgeContract.on("Transfer", async (from, to, amount, nonce, signature, event) => {
  console.log(`Transfer event detected: from ${from} to ${to}, value: ${amount}`);
  console.log('Event details:', event);

  const tx = ethBridgeContract.methods.mint(from, to, amount, nonce, signature);
  const [gasPrice, gasCost] = await getGasInfo(tx)
  const data = tx.encodeABI();

  const txData = {
    from: wallet.address,
    to: ethBridgeContractAddress,
    data,
    gas: gasCost,
    gasPrice
  };

  const txResponse = wallet.sendTransaction(txData)

  const receipt = await txResponse.wait();

  console.log(receipt)
});

async function getGasInfo(tx) {
  const gasPrice = await ethProvider.getGasPrice();
  const gasCost = await tx.estimateGas({ from: "0x2dfFF737EB054DED9795d96d6d9B9909896BB940" });
  return [gasPrice, gasCost];
}
