const BridgeEth = artifacts.require('./BridgeEth.sol');

const fs = require('fs');
// const mnemonic = fs.readFileSync('.secret').toString().trim();
const mnemonic = "liquid brand gaze spare someone toe cause nuclear rug west wash mask"
const ethers = require('ethers')
const wallet = ethers.Wallet.fromPhrase(mnemonic)

const privKey = wallet.privateKey;
console.log(`Private key: ${wallet.privateKey}`)
console.log(`Address: ${wallet.address}`)

module.exports = async done => {
  const nonce = 1; //Need to increment this for each new transfer
  const accounts = await web3.eth.getAccounts();
  const bridgeEth = await BridgeEth.deployed();
  const amount = 1;
  const message = web3.utils.soliditySha3(
    { t: 'address', v: accounts[0] },
    { t: 'address', v: accounts[0] },
    { t: 'uint256', v: amount },
    { t: 'uint256', v: nonce },
  ).toString('hex');
  const { signature } = web3.eth.accounts.sign(
    message,
    privKey
  );
  await bridgeEth.burn(accounts[0], amount, nonce, signature);
  done();
}
