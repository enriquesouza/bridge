# bridge

https://docs.thetatoken.org/docs/theta-blockchain-tnt20-token-integration-guide


Theta Mainnet
ETH RPC URL: https://eth-rpc-api.thetatoken.org/rpc
Explorer: https://explorer.thetatoken.org/
Chain ID: 361

Theta Testnet
ETH RPC URL: https://eth-rpc-api-testnet.thetatoken.org/rpc
Explorer: https://testnet-explorer.thetatoken.org/
Chain ID: 365

On macos

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
# In the first terminal
arch -arch x86_64 ./theta start --config=../privatenet/validator --password=qwertyuiop

# In the second terminal
arch -arch x86_64 ./theta-eth-rpc-adaptor start --config=../privatenet/eth_rpc_adaptor
```


Hardhat Configs

To use these prefunded test wallets for Hardhat, modidfy the hardhat.config.js file to include the following. Then, you can run the test cases with npx hardhat test --network theta_privatenet .

```
module.exports = {
  mocha: {
    timeout: 1000000000,
  },
  networks: {
    theta_privatenet: {
      url: "http://localhost:18888/rpc",
      accounts: [
        "1111111111111111111111111111111111111111111111111111111111111111", // 0x19E7E376E7C213B7E7e7e46cc70A5dD086DAff2A
        "2222222222222222222222222222222222222222222222222222222222222222", // 0x1563915e194D8CfBA1943570603F7606A3115508
        "3333333333333333333333333333333333333333333333333333333333333333", // 0x5CbDd86a2FA8Dc4bDdd8a8f69dBa48572EeC07FB
        "4444444444444444444444444444444444444444444444444444444444444444", // 0x7564105E977516C53bE337314c7E53838967bDaC
        "5555555555555555555555555555555555555555555555555555555555555555", // 0xe1fAE9b4fAB2F5726677ECfA912d96b0B683e6a9
        "6666666666666666666666666666666666666666666666666666666666666666", // 0xdb2430B4e9AC14be6554d3942822BE74811A1AF9
        "7777777777777777777777777777777777777777777777777777777777777777", // 0xAe72A48c1a36bd18Af168541c53037965d26e4A8
        "8888888888888888888888888888888888888888888888888888888888888888", // 0x62f94E9AC9349BCCC61Bfe66ddAdE6292702EcB6
        "9999999999999999999999999999999999999999999999999999999999999999", // 0x0D8e461687b7D06f86EC348E0c270b0F279855F0
        "1000000000000000000000000000000000000000000000000000000000000000", // 0x7B2419E0Ee0BD034F7Bf24874C12512AcAC6e21C
      ],
      chainId: 366,
      gasPrice: 4000000000000,
    },
    ...
 },
 ...
}
```


In addition to these prefunded test wallets, the RPC adaptor will create 10 random test wallets the first time it runs, which will be useful for running tests with dev tools like Truffle and Hardhat. 

After the test wallets are created, the ETH RPC APIs will be ready for use. To fund these randomly generated test wallets, you can execute the following command (replace <WALLET_ADDRESS> with the actual address):

```
export SEQ=`./thetacli query account --address=0x2E833968E5bB786Ae419c4d13189fB081Cc43bab | grep sequence | grep -o '[[:digit:]]\+'`
./thetacli tx send --chain="privatenet" --from=0x2E833968E5bB786Ae419c4d13189fB081Cc43bab --to=<WALLET_ADDRASS> --tfuel=10000 --password=qwertyuiop --seq=$(($SEQ+1))
```



    export SEQ=`arch -arch x86_64 ./thetacli query account --address=0x2E833968E5bB786Ae419c4d13189fB081Cc43bab | grep sequence | grep -o '[[:digit:]]\+'`

    arch -arch x86_64 ./thetacli tx send --chain="privatenet" --from=0x2E833968E5bB786Ae419c4d13189fB081Cc43bab --to=0x19E7E376E7C213B7E7e7e46cc70A5dD086DAff2A --tfuel=1000 --password=qwertyuiop --seq=$(($SEQ+1))