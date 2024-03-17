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
  const nonce = 14;


  const tokenAddress = '0xCAF714B05f89254Ea7ECa464378bD45a10c1dBAE'; // Token contract address
  const tokenContract = new ethers.Contract(tokenAddress, TokenEthArtifact.abi, signer);
  
  const bridgeEthAddress = '0x443a0232E358A58245ad39475769b5060301ffc2';
  const bridgeEth = new ethers.Contract(bridgeEthAddress, BridgeEthArtifact.abi, signer);

  const amount = ethers.parseUnits('1', 'ether');
  const signerAddress = await signer.getAddress();

  // Check allowance
  const allowance = await tokenContract.allowance(signerAddress, bridgeEthAddress);
  if (allowance < amount) {
    // Approve the bridge contract to spend tokens
    const approveTx = await tokenContract.approve(bridgeEthAddress, amount);
    await approveTx.wait(); // Wait for the transaction to be mined
    console.log(`Approved ${amount} tokens for the bridge contract.`);
  }

  const abiCoder = ethers.AbiCoder.defaultAbiCoder()
  const types = ['address', 'address', 'uint256', 'uint256'];
  const values = [signerAddress, signerAddress, amount, nonce];
  const encodedData = abiCoder.encode(types, values);
  const messageHash = ethers.keccak256(encodedData);
  const signature = await signer.signMessage(messageHash);
  await bridgeEth.burn(signerAddress, amount, nonce, signature);

  console.log("Transaction sent")
};

send()