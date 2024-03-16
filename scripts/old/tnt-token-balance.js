const TokenTnt = artifacts.require('./TokenTnt');

module.exports = async done => {
  const [recipient, _] = await web3.eth.getAccounts();
  const tokenTnt = await TokenTnt.deployed();
  const balance = await tokenTnt.balanceOf(recipient);
  console.log(balance.toString());
  done();
}
