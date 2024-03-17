const Web3 = require('web3')
const web3 = new Web3('https://polygon-mumbai.infura.io/v3/fe61370c71034c7fadb5161f6a4381b9')

const ReplayTokenABI = require('../build/contracts/ReplayToken.json').abi;

const address = '0xB88ea1933e9b783E57bdb4fDe85366C41D28D447'
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

contract.methods.balanceOf('0xAaAd0a442e094861A8C0F964E418fde595Df188F').call((err, result) => {
    console.log("balance of the bridge 0xAaAd0a442e094861A8C0F964E418fde595Df188F:", result, "RPT")
})