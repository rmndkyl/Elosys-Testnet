require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
const fs = require('fs');

// Read private keys from privateKeys.json
const privateKeys = JSON.parse(fs.readFileSync('privateKeys.json')).privateKeys;

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