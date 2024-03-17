const ethers = require('ethers');
const BridgeTntArtifact = require('../build/contracts/BridgeTnt.json');
const TokenTntArtifact = require('../build/contracts/ReplayToken.json');
const provider = new ethers.JsonRpcProvider('https://eth-rpc-api-testnet.thetatoken.org/rpc');
// Reading the mnemonic and creating a wallet
const mnemonic = "liquid brand gaze spare someone toe cause nuclear rug west wash mask";
const wallet = ethers.Wallet.fromPhrase(mnemonic);
const signer = wallet.connect(provider);
//
console.log(`Private key: ${wallet.privateKey}`);
console.log(`Address: ${wallet.address}`);

const send = async (done) => {
  //TODO: Save the nonce somewhere to control it
  //TODO: Get the current nonce
  const nonce = 2;


  const tokenAddress = '0x2D46381bB20E533EF9644b9cD7DcAAe88529ebd9'; // Token contract address eth
  const tokenContract = new ethers.Contract(tokenAddress, TokenTntArtifact.abi, signer);
  
  const bridgeTntAddress = '0xEe285da7c361Da4D1486b570322FB273A6304a19';
  const bridgeTnt = new ethers.Contract(bridgeTntAddress, BridgeTntArtifact.abi, signer);

  const amount = ethers.parseUnits('1', 'ether');
  const signerAddress = await signer.getAddress();

  // Check allowance
  const allowance = await tokenContract.allowance(signerAddress, bridgeTntAddress);
  if (allowance < amount) {
    // Approve the bridge contract to spend tokens
    const approveTx = await tokenContract.approve(bridgeTntAddress, amount);
    await approveTx.wait(); // Wait for the transaction to be mined
    console.log(`Approved ${amount} tokens for the bridge contract.`);
  }

  const abiCoder = ethers.AbiCoder.defaultAbiCoder()
  const types = ['address', 'address', 'uint256', 'uint256'];
  const values = [signerAddress, signerAddress, amount, nonce];
  const encodedData = abiCoder.encode(types, values);
  const messageHash = ethers.keccak256(encodedData);
  const signature = await signer.signMessage(messageHash);
  const burnTx = await bridgeTnt.burn(signerAddress, amount, nonce, signature);
  await burnTx.wait()

  console.log("Tnt Transaction sent", burnTx)
};

send()