const BridgeEth = artifacts.require('BridgeEth');
const BridgeTnt = artifacts.require('BridgeTnt');
const ReplayToken = artifacts.require('ReplayToken');

module.exports = async function (deployer, network, addresses) {
  // Deploy ReplayToken first with initial parameters
  await deployer.deploy(
    ReplayToken,
    "ReplayToken", // Name of the token
    "RPT", // Symbol of the token
    18, // Decimals
    web3.utils.toBN("1000000000000000000000000"), // Max supply
    addresses[0], // Minter as deployer
    web3.utils.toBN("100"), // Staker reward per block
    addresses[0], // Initial distribution to deployer
    web3.utils.toBN("500000000000000000000000"), // Initial mint amount
    addresses[0] // Temporary admin, to be updated later
  );
  const replayToken = await ReplayToken.deployed();

  if (network === 'development') {
    await deployer.deploy(BridgeEth, replayToken.address);
    const bridgeEth = await BridgeEth.deployed();

    // Update ReplayToken's admin to BridgeEth's address
    await replayToken.updateAdmin(bridgeEth.address);
  } else if (network === 'theta_testnet') {
    await deployer.deploy(BridgeTnt, replayToken.address);
    const bridgeTnt = await BridgeTnt.deployed();

    // Update ReplayToken's admin to BridgeTnt's address
    await replayToken.updateAdmin(bridgeTnt.address);
  }
};
