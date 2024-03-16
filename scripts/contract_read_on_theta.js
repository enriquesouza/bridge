const Web3 = require('web3')
const web3 = new Web3('https://eth-rpc-api-testnet.thetatoken.org/rpc')

const ReplayTokenABI = require('../build/contracts/ReplayToken.json').abi;

const address = '0xA5e5Ebe054F99bf6f5f50B10D385fB4780949Fc4'
const contract = new web3.eth.Contract(ReplayTokenABI, address)

contract.methods.totalSupply().call((err, result) => {
    console.log("totalSupply:", result, "RPT")
})

contract.methods.name().call((err, result) => {
    console.log("name:", result)
})

contract.methods.symbol().call((err, result) => {
    console.log("symbol:", result)
})

contract.methods.balanceOf('0x2dfFF737EB054DED9795d96d6d9B9909896BB940').call((err, result) => {
    console.log("balance of 0x2dfFF737EB054DED9795d96d6d9B9909896BB940:", result, "RPT")
})