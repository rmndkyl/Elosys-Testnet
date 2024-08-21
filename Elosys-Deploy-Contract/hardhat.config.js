require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
const fs = require('fs');

// Read private keys from privateKeys.txt
const privateKeys = fs.readFileSync('privateKeys.txt', 'utf-8').trim().split('\n').map(key => `0x${key.trim()}`);

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  networks: {
    custom: {
      url: process.env.RPC_URL,
      accounts: privateKeys
    }
  }
};
