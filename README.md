# FUN Token

FUN Token Demo app that uses a basic ERC20 token deplpoyed on the Koven testnet. You can view the deployed token [here](https://kovan.etherscan.io/address/0x7f850531e88E0841197ca1351eB7CDB54bD66900#writeContract).

This app is built with Truffle to deploy and verify the token contract. OpenZeppelin contracts are used to import mintable and burnable functionality. The front end was started with react-react-app. Front end interaction with the token contract is done with ethers.js and Metamask.

The app lets a user that has signed into Metamask and connected to the Kovan network preform the following actions:

1. Mint more FUN tokens
2. Burn FUN tokens
3. Transfer FUN tokens to a designated eth address

## Installation

Run these commands in the project directory
```bash
npm install -g truffle
truffle init
```

```bash
npm init -y
npm install @openzeppelin/contracts
```

Configure your `.env`:
```bash
PRIVATE_KEY=0x???
KOVAN_RPC_URL='https://kovan.infura.io/v3/???'
ETHERSCAN_API_KEY=???
```

## Running locally

`cd` into the `client` directory to run the front end