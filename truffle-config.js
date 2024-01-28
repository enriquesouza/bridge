
const HDWalletProvider = require('@truffle/hdwallet-provider');
const fs = require('fs');
const mnemonic = fs.readFileSync('.secret').toString().trim();
const HDWalletProvider = require('@truffle/hdwallet-provider');

module.exports = {
  networks: {
    development: {
      host: '127.0.0.1',
      port: 8545,
      network_id: '*',
      allowUnlimitedContractSize: true,
      timeoutBlocks: 200,
      skipDryRun: true,
      websockets: true,
      networkCheckTimeout: 1000000,
      provider: () =>
        new HDWalletProvider({
          mnemonic: mnemonic,
          providerOrUrl: `ws://localhost:8545`,
          numberOfAddresses: 100,
        }),
    },


    theta_privatenet: {
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
      gasPrice: 4000000000000,
    },

    ethTestnet: {
      provider: () => new HDWalletProvider(
        mnemonic,
        'url to eth node',
        0,
        1
      ),
      network_id: 4, //rinkeby
      skipDryRun: true
    },

    theta_testnet: {
      provider: () => {

        // Replace the private key below with the private key of the deployer wallet. 
        // Make sure the deployer wallet has a sufficient amount of TFuel, e.g. 100 TFuel
        var deployerPrivateKey = '12345';

        return new HDWalletProvider({
          privateKeys: [deployerPrivateKey],
          providerOrUrl: 'https://eth-rpc-api-testnet.thetatoken.org/rpc',
        });
      },
      network_id: 365,
      gasPrice: 4000000000000,
    },

    theta_mainnet: {
      provider: () => {

        // Replace the private key below with the private key of the deployer wallet. 
        // Make sure the deployer wallet has a sufficient amount of TFuel, e.g. 100 TFuel
        var deployerPrivateKey = '12345';

        return new HDWalletProvider({
          privateKeys: [deployerPrivateKey],
          providerOrUrl: 'https://eth-rpc-api.thetatoken.org/rpc',
        });
      },
      network_id: 361,
      gasPrice: 4000000000000,
    }
  },

  // Set default mocha options here, use special reporters etc.
  mocha: {
    enableTimeouts: false,
    before_timeout: 480000
  },


  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.24",
    }
  }
};
