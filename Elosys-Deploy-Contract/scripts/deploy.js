const hre = require("hardhat");
const fs = require('fs');

async function main() {
  // Read private keys from privateKeys.txt
  const privateKeys = fs.readFileSync('privateKeys.txt', 'utf-8').trim().split('\n').map(key => `0x${key.trim()}`);

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
