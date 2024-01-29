const TokenEth = artifacts.require('TokenEth');
const TokenTnt = artifacts.require('TokenTnt');
const BridgeEth = artifacts.require('BridgeEth');
const BridgeTnt = artifacts.require('BridgeTnt');

module.exports = async function (deployer, network, addresses) {
  if (network === 'development') {
    await deployer.deploy(TokenEth);
    const tokenEth = await TokenEth.deployed();
    await tokenEth.mint(addresses[0], 1000);
    await deployer.deploy(BridgeEth, tokenEth.address);
    const bridgeEth = await BridgeEth.deployed();
    await tokenEth.updateAdmin(bridgeEth.address);
  }
  if (network === 'theta_privatenet') {
    await deployer.deploy(TokenTnt);
    const tokenTnt = await TokenTnt.deployed();
    await deployer.deploy(BridgeTnt, tokenTnt.address);
    const bridgeTnt = await BridgeTnt.deployed();
    await tokenTnt.updateAdmin(bridgeTnt.address);
  }
};
