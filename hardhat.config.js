require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config(); // Make sure to require dotenv to load the environment variables

// Extract the Infura URL and private key from environment variables
const { INFURA_SEPOLIA_URL, DEPLOYER_PRIVATE_KEY } = process.env;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  mocha: {
    timeout: 1000000000,
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: "VVJHTBDJHAZD3SE4PX5Y5VV3UP3FWPJ9WE"
  },
  sourcify: {
    // Disabled by default
    // Doesn't need an API key
    enabled: true
  },
  networks: {
    theta_privatenet: {
      url: "http://localhost:18888/rpc",
      accounts: [
        "1111111111111111111111111111111111111111111111111111111111111111",
        "2222222222222222222222222222222222222222222222222222222222222222",
        // Additional accounts as needed
      ],
      chainId: 366,
      gasPrice: 4000000000000,
    },
    sepolia: {
      url: "https://sepolia.infura.io/v3/fe61370c71034c7fadb5161f6a4381b9",
      accounts: ["0x675a916e0fa4bfa9435cafb158173059bc3057bbabd11016ede6f3b7d37add3b"], // Filters out any undefined or empty strings
      chainId: 11155111, // Sepolia's chain ID
    },
  },
};
