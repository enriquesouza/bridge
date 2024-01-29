const Web3 = require('web3');
const BridgeEth = require('../build/contracts/BridgeEth.json');
const BridgeTnt = require('../build/contracts/BridgeTnt.json');
const web3Eth = new Web3(`ws://localhost:8545`);
const web3Tnt = new Web3('ws://127.0.0.1:18889');

// GET THE WALLET FROM mnemonic
const fs = require('fs');
const mnemonic = fs.readFileSync('.secret').toString().trim();
const ethers = require('ethers')
const wallet = ethers.Wallet.fromPhrase(mnemonic)
console.log(`Private key: ${wallet.privateKey}`)
console.log(`Address: ${wallet.address}`)
const { address: admin } = web3Tnt.eth.accounts.wallet.add(wallet.privateKey);

web3Tnt.eth.getBalance('0x19E7E376E7C213B7E7e7e46cc70A5dD086DAff2A').then(balance => console.log(`TFULL`, `0x19E7E376E7C213B7E7e7e46cc70A5dD086DAff2A`, balance))
web3Tnt.eth.getBalance(admin).then(balance => console.log(`TFULL`, admin, balance))



// Ganache
const bridgeEth = new web3Eth.eth.Contract(
  BridgeEth.abi,
  BridgeEth.networks[Object.keys(BridgeEth.networks)[0]].address
);

// // Theta Private Network
const bridgeTnt = new web3Tnt.eth.Contract(
  BridgeTnt.abi,
  BridgeTnt.networks['366'].address
);

return
bridgeEth.events.Transfer(
  { fromBlock: 0, step: 0 }
)
  .on('data', async event => {
    const { from, to, amount, date, nonce, signature } = event.returnValues;

    const tx = bridgeTnt.methods.mint(from, to, amount, nonce, signature);
    const [gasPrice, gasCost] = await Promise.all([
      web3Tnt.eth.getGasPrice(),
      tx.estimateGas({ from: admin }),
    ]);
    const data = tx.encodeABI();
    const txData = {
      from: admin,
      to: bridgeTnt.options.address,
      data,
      gas: gasCost,
      gasPrice
    };
    const receipt = await web3Tnt.eth.sendTransaction(txData);
    console.log(`Transaction hash: ${receipt.transactionHash}`);
    console.log(`
    Processed transfer:
    - from ${from} 
    - to ${to} 
    - amount ${amount} tokens
    - date ${date}
    - nonce ${nonce}
  `);
  });
