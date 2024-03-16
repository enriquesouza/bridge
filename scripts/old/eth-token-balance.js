const Token = artifacts.require('./ReplayToken.sol');

module.exports = async done => {
  const [sender, _] = await web3.eth.getAccounts();
  const token = await Token.deployed();
  const balance = await token.balanceOf(sender);
  console.log(balance.toString());
  done();
}
