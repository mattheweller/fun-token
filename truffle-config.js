const HDWalletProvider = require('@truffle/hdwallet-provider')
require('dotenv').config()

module.exports = {
  networks: {
    kovan: {
      provider: () => {
        return new HDWalletProvider(process.env.PRIVATE_KEY, process.env.KOVAN_RPC_URL)
      },
      network_id: '42',
      skipDryRun: true,
    },
  },
  compilers: {
    solc: {
      version: '0.8.11',
    },
  },
  api_keys: {
    etherscan: process.env.ETHERSCAN_API_KEY
  },
  plugins: [
    'truffle-plugin-verify'
  ]
}
