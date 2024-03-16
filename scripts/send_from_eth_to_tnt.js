const ethers = require('ethers');
const BridgeEthArtifact = require('../build/contracts/BridgeEth.json'); // Adjust the path to your artifact
const TokenEthArtifact = require('../build/contracts/ReplayToken.json'); // Adjust the path to your artifact

// Assuming you have a provider URL (e.g., Infura, Alchemy)
const providerUrl = 'wss://polygon-mumbai.infura.io/ws/v3/fe61370c71034c7fadb5161f6a4381b9';
const provider = new ethers.WebSocketProvider(providerUrl);

// Reading the mnemonic and creating a wallet
const mnemonic = "liquid brand gaze spare someone toe cause nuclear rug west wash mask";
const wallet = ethers.Wallet.fromPhrase(mnemonic);
const signer = wallet.connect(provider);

console.log(`Private key: ${wallet.privateKey}`);
console.log(`Address: ${wallet.address}`);

const send = async (done) => {
  //TODO: Save the nonce somewhere to control it
  //TODO: Get the current nonce
  const nonce = 1;


  const tokenAddress = '0xD393A1a8a189F9803325188ea6Dc21B1c2fe75EF'; // Token contract address
  const tokenContract = new ethers.Contract(tokenAddress, TokenEthArtifact.abi, signer);
  
  const bridgeEthAddress = '0x7eBf9fCaC5FDe523c3Be67cF1b30b11F8a9C1571';
  const bridgeEth = new ethers.Contract(bridgeEthAddress, BridgeEthArtifact.abi, signer);

  const amount = ethers.parseUnits('1', 'ether');
  const accounts = await signer.getAddress();

  const abiCoder = ethers.AbiCoder.defaultAbiCoder()
  const types = ['address', 'address', 'uint256', 'uint256'];
  const values = [accounts, accounts, amount, nonce];
  const encodedData = abiCoder.encode(types, values);
  const messageHash = ethers.keccak256(encodedData);
  const signature = await signer.signMessage(messageHash);
  await bridgeEth.burn(accounts, amount, nonce, signature);
  done();
};

send()