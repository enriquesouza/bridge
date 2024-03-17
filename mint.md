# Minting on Replays

This function, has the mint function and also transfer from the contract to the user.

```
❯ node scripts/deploy_on_eth.js
Token deployed to: 0xF250DCE9AAAE0220523310483f51418051Ba5e8c
Bridge deployed to: 0x367Fa6E0a8092E4255F2DBc565d0598998D45247
ETH sent, transaction hash: 0x7f5211717486b7cec2a5deca6601d215f6ec004ad2736cd943e5871198ba2513
updateAdmin transaction hash: 0x6ab574287c046bf9a224010091150c93bc506d60949b5de41686c39cc19ed8da



❯ node scripts/deploy_on_theta.js
Token deployed to: 0x2D46381bB20E533EF9644b9cD7DcAAe88529ebd9
Bridge deployed to: 0xEe285da7c361Da4D1486b570322FB273A6304a19
THETA sent, transaction hash: 0x628910c4d41249c3bf6b33ee741c4d18a3bbdea63bcf8a8bd343f6fea5e464e8
updateAdmin transaction hash: 0xd4c727a9f0887451c57e2482a666754a3244bc8da69ffead814002e894f3d864
```

Working transactions

```
❯ node scripts/eth_bridge.js
Debugger attached.
Listening to Transfer events on MATIC...
Transfer event detected: from 0x2dfFF737EB054DED9795d96d6d9B9909896BB940 to 0x2dfFF737EB054DED9795d96d6d9B9909896BB940, value: 1000000000000000000
Event details: 0x6b5738f028fa82c4420c37cc6f0501f8e32db61fc194c99e2ad2479c18711cb15bad2c2f13e718a19652187ac088389abce5a2e68fc313a90c5309e20aee03131b
ContractTransactionResponse {
  provider: JsonRpcProvider {},
  blockNumber: null,
  blockHash: null,
  index: undefined,
  hash: '0x66f7713c000a1882d489d1091510b58f2ebd1a1d0d29387d61ca7007f39a8087',
  type: 0,
  to: '0xEe285da7c361Da4D1486b570322FB273A6304a19',
  from: '0x2dfFF737EB054DED9795d96d6d9B9909896BB940',
  nonce: 54,
  gasLimit: 70833n,
  gasPrice: 4000000000000n,
  maxPriorityFeePerGas: null,
  maxFeePerGas: null,
  maxFeePerBlobGas: null,
  data: '0x52555702000000000000000000000000ee285da7c361da4d1486b570322fb273a6304a19000000000000000000000000ee285da7c361da4d1486b570322fb273a6304a190000000000000000000000000000000000000000000000000de0b6b3a76400000000000000000000000000000000000000000000000000000000000065f6687600000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000419f6a3345adfd44e7c5633466ae053397a212675d96251563db899a9743317de64f66759f46275def53ce0a62ebd9f1ad1bcc27a7935a36378568eb0efd2fc4891b00000000000000000000000000000000000000000000000000000000000000',
  value: 0n,
  chainId: 365n,
  signature: Signature { r: "0x76c4b11ef9ccb0bf2ab427120139f32c5101709a821fad673370caf7f60a5215", s: "0x5e6d978d475468de46ba8198387ee0b78181fed6da45894094aaaf82d21d5276", yParity: 0, networkV: 765 },
  accessList: null,
  blobVersionedHashes: null
}
ContractTransactionResponse {
  provider: JsonRpcProvider {},
  blockNumber: null,
  blockHash: null,
  index: undefined,
  hash: '0x55125d178f46d04bd86b4c31113bf3c4d9508395b91e9a1f62168bd55f5688f2',
  type: 0,
  to: '0xEe285da7c361Da4D1486b570322FB273A6304a19',
  from: '0x2dfFF737EB054DED9795d96d6d9B9909896BB940',
  nonce: 55,
  gasLimit: 43761n,
  gasPrice: 4000000000000n,
  maxPriorityFeePerGas: null,
  maxFeePerGas: null,
  maxFeePerBlobGas: null,
  data: '0x3e20e1190000000000000000000000002dfff737eb054ded9795d96d6d9b9909896bb9400000000000000000000000000000000000000000000000000de0b6b3a7640000',
  value: 0n,
  chainId: 365n,
  signature: Signature { r: "0x9772ee70e5338b0c4a8751b8d13cf53446b5409b612ea8d04be1622948f90e4f", s: "0x350b5e28008d95671a3858d88a9fd608a0165219036d18f30693a450300d636a", yParity: 1, networkV: 766 },
  accessList: null,
  blobVersionedHashes: null
}
```