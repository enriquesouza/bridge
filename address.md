# Ensuring that Replay's uses the same address

### Nonce

The current nonce is **2**. We must keep it in all networks.

#

Deploying a smart contract across different blockchains (Ethereum, Polygon, Arbitrum, etc.) and ensuring it has the **same address** on each network.

There is a method known as **"Nick Johnson's method"** that can be used to achieve deterministic deployment of a contract, allowing for the same address on different networks.

We need to ensure the same **NONCE** in all networks. So we need to check which nonce was used when you published on THETA.

***To increase the chance of having the same address in all networks after deploying we would need:**

**Ensure Identical Byte-code:** Compile your contract with the same settings (including constructor parameters, if any) to get the identical **byte-code** for every network. 

> I got it from theta-scan.

The owner:
https://explorer.thetatoken.org/account/0xb6255e00a205bf421cd2633725c40ea07c5c62ae

The contract:
https://www.thetascan.io/contracts/?data=0x3da3d8cde7b12cd2cbb688e2655bcacd8946399d

**Adjust Nonce:** Before deploying, we must ensure the account you're using has the same nonce on each network. I need to get the transaction we sent to deploy this smart contract.

[ X ] - Try to find the transaction

https://explorer.thetatoken.org/txs/0xd9e8b48bf90683c20198d01e5b67325f8f2e2efea5c648af91a8076a9c741ccd#Logs

[ x ] - After finding the transaction, then try to find the nonce used

The sequence of the transaction is **marked as 3**
https://www.thetascan.io/download_txn/?hash=0xd9e8b48bf90683c20198d01e5b67325f8f2e2efea5c648af91a8076a9c741ccd

The owner current sequence is 4, but it is not the smart contract:
https://explorer.thetatoken.org/account/0xb6255e00a205bf421cd2633725c40ea07c5c62ae

# **2 is the nonce**

I also locally run some tests using the byte-code and the encode constructors parameters and I could see that it works. We can have the same address in different blockchains. We just need to ensure the byte-code, the encoded constructor parameters and the nonce.

**Tests:**

First i've created three contracts, then I reset my servers to rest the nonce and the transactions.

The result was:

```
// Contract created: 0x582a5e1b7c893df82993b92e5ea5bc6df16b81af

// Contract created: 0x764e75692bac03d8420ce52e28cc926e103f8ec1

// Contract created: 0x491f6cce029f97e0f91cfa165f2f6678423b92a2
```

Then I started a clean server to match the addresses and it works.

```
❯ node migrations/0_deploy-replay.js

# Nonce 0
Contract Address: 0x582a5e1b7c893df82993B92E5eA5Bc6df16b81AF

❯ node migrations/0_deploy-replay.js

# Nonce 1
Contract Address: 0x764E75692baC03D8420Ce52E28cC926E103f8eC1

❯ node migrations/0_deploy-replay.js

# Nonce 2
Contract Address: 0x491f6cCe029F97E0F91cFa165F2f6678423B92a2
```