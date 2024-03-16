const Web3 = require('web3')
const web3 = new Web3('https://polygon-mumbai.infura.io/v3/fe61370c71034c7fadb5161f6a4381b9')

const ReplayTokenABI = require('../build/contracts/ReplayToken.json').abi;

const address = '0xD393A1a8a189F9803325188ea6Dc21B1c2fe75EF'
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