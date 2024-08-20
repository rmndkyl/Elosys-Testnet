const hre = require("hardhat");
const fs = require('fs');

async function main() {
  // Read private keys from privateKeys.json
  const privateKeys = JSON.parse(fs.readFileSync('privateKeys.json')).privateKeys;

  // Loop over each private key
  for (let i = 0; i < privateKeys.length; i++) {
    const wallet = new hre.ethers.Wallet(privateKeys[i], hre.ethers.provider);

    console.log(`Deploying contract with private key ${i + 1}/${privateKeys.length}...`);

    const Token = await hre.ethers.getContractFactory("Token", wallet);
    const token = await Token.deploy();

    console.log("Deploying Contract...");
    await token.waitForDeployment();

    const contractAddress = await token.getAddress();

    if (process.env.EXPLORER) {
      console.log("Contract deployed to:", `${process.env.EXPLORER}/address/${contractAddress}`);
    } else {
      console.log("Contract deployed to:", contractAddress);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});