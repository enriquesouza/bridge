# Theta bridge

https://docs.thetatoken.org/docs/theta-blockchain-tnt20-token-integration-guide

Theta Mainnet
```
ETH RPC URL: https://eth-rpc-api.thetatoken.org/rpc
Explorer: https://explorer.thetatoken.org/
Chain ID: 361
```

Theta Testnet
```
ETH RPC URL: https://eth-rpc-api-testnet.thetatoken.org/rpc
Explorer: https://testnet-explorer.thetatoken.org/
Chain ID: 365
```

## Theta local installation

### On MacOS

First, run the following commands in a terminal to download and unzip the Theta local privatenet binaries and configs.
```
wget https://theta-downloader.s3.amazonaws.com/ethrpc/theta_local_privatenet_macos.tar.gz
tar -xvzf theta_local_privatenet_macos.tar.gz
cd theta_local_privatenet_macos/bin
```

Starting with macOS v10.15 Catalina, only signed applications are allowed to run. We need to run the following commands to manually add the downloaded binaries to the allowed applications. You might be prompted to enter your Macbook password or use the touch ID to allow access.
```
sudo spctl --add ./theta
sudo spctl --add ./thetacli
sudo spctl --add ./theta-eth-rpc-adaptor
```

Note: If you are using a Mac with the M1 chip, you might need to add the arch -arch x86_64 prefix to the commands as shown below:

```
cd theta_local_privatenet_macos/bin
# In the first terminal
arch -arch x86_64 ./theta start --config=../privatenet/validator --password=qwertyuiop

# In the second terminal
arch -arch x86_64 ./theta-eth-rpc-adaptor start --config=../privatenet/eth_rpc_adaptor
```

## Publishing on theta

First we need send some coins to pay the gas TFUEL
```
node scripts/send_signed_transaction.js    
```

Token deploy on Theta
```
npx truffle deploy --network theta_privatenet
```

If you need to force then use

```
npx truffle deploy --network theta_privatenet --reset
```

Starting the Ethereum server (Ganache)
```
npm run ganache
```

Token deploy on Ethereum server (Ganache)
```
npx truffle deploy --network development
```

Get the balance of the deployed token on Theta Network. *It should be ZERO now
```
npx truffle exec scripts/tnt-token-balance.js --network theta_privatenet
```

Get the balance of the deployed token on Ethereum Network (Ganache). *It should be zero 1000
```
npx truffle exec scripts/eth-token-balance.js --network development
```

Now we can try to start the bridge listener, so it can start listening transactions.
This is a service that will keep listing the blockchain transactions.
```
node scripts/eth-tnt-bridge.js
```

Now we can send from Ethereum network to Theta network
```
npx truffle exec scripts/eth-tnt-transfer.js --network development         
```

Now it should have 999 tokens on ETH and 1 on THETA

```
npx truffle exec scripts/tnt-token-balance.js --network theta_privatenet
npx truffle exec scripts/eth-token-balance.js --network development
```


## Known issues

_Since I am not using the testnet directly but GANACHE and Theta private network, and I am not using the same private keys, the signature won't match. So the bridge won't mint correctly. So we had to disable it for testing purposes._

**Uncomment the following lines to check the signature on contracts/BridgeBase.sol**
```
// bytes32 message = keccak256(abi.encodePacked(from, to, amount, nonce));
// require(recoverSigner(message, signature) == from, "wrong signature");
```