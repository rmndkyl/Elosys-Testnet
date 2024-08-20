import { ethers } from 'ethers';
import fs from 'fs';
import readlineSync from 'readline-sync';
import chalk from 'chalk';
import { log } from './utils/logger.js';
import { printName } from './utils/name.js';

// Load network configuration
const networkConfig = JSON.parse(fs.readFileSync('./config/network.json', 'utf-8'));

// Load private keys from privateKeys.json
const privateKeys = JSON.parse(fs.readFileSync('./config/privateKeys.json', 'utf-8'));

// Function to select network
function selectNetwork(networkIndex) {
    const networkNames = Object.keys(networkConfig);
    const networkName = networkNames[networkIndex - 1];
    if (!networkName) {
        throw new Error(`Network with index ${networkIndex} not found in configuration`);
    }
    return networkConfig[networkName];
}

// Function to display available networks
function displayNetworks() {
    const networkNames = Object.keys(networkConfig);
    console.log(chalk.blueBright('Available Networks:'));
    networkNames.forEach((name, index) => {
        console.log(`${index + 1}: ${name}`);
    });
}

// Function to prompt user for input using readline-sync
function promptUser(question) {
    return readlineSync.question(chalk.blueBright(question));
}

// Function to add a new network
function addNetwork() {
    const name = promptUser('Enter Network Name, e.g., Zero Testnet: ');
    const rpcUrl = promptUser('Enter RPC URL, e.g., https://: ');
    const chainId = promptUser('Enter Chain ID: ');

    if (networkConfig[name]) {
        throw new Error(`Network with name ${name} already exists`);
    }

    networkConfig[name] = {
        RPC_URL: rpcUrl,
        CHAIN_ID: chainId
    };

    fs.writeFileSync('./config/network.json', JSON.stringify(networkConfig, null, 2));
    console.log(chalk.greenBright('Network added successfully!'));
}

// Function to read addresses from file
function readAddressesFromFile(filename) {
    try {
        const data = fs.readFileSync(filename, 'utf-8');
        return data.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    } catch (err) {
        throw new Error(`Error reading file ${filename}: ${err.message}`);
    }
}

// Function to generate random EVM addresses
function generateRandomAddresses(count) {
    const randomAddresses = new Array(count);
    for (let i = 0; i < count; i++) {
        randomAddresses[i] = ethers.Wallet.createRandom().address;
    }
    return randomAddresses;
}

// Function to wait for a specified number of milliseconds
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Function to generate a random amount within the specified range
function getRandomAmount(min, max) {
    const random = Math.random() * (max - min) + min;
    return ethers.parseUnits(random.toFixed(18), 'ether'); // Adjust precision as needed
}

async function main() {
    printName();

    //const action = promptUser('Do you want to add a new network? (y/n): ');

    //if (action.toLowerCase() === 'y') {
    //    addNetwork();
    //}

    // Display and select network
    displayNetworks();
    const networkIndex = parseInt(promptUser('Select Network by Number: '), 10);
    const { RPC_URL, CHAIN_ID } = selectNetwork(networkIndex);

    // Prompt user for the range of amounts to send to each address
    const minAmount = parseFloat(promptUser('Enter minimum amount of Ether to send to each address (e.g., 0.01): '));
    const maxAmount = parseFloat(promptUser('Enter maximum amount of Ether to send to each address (e.g., 0.1): '));

    // Validate the range
    if (isNaN(minAmount) || isNaN(maxAmount) || minAmount <= 0 || maxAmount <= 0 || minAmount > maxAmount) {
        throw new Error('Invalid amount range. Ensure that both minimum and maximum amounts are positive numbers and the minimum is less than or equal to the maximum.');
    }

    // Prompt user for transaction details
    const sendMode = promptUser('Do you want to send to random addresses or specific addresses? (random/specific): ');

    let addresses = [];
    if (sendMode.toLowerCase() === 'specific') {
        // Read addresses from file
        addresses = readAddressesFromFile('./addresses.txt');
        if (addresses.length === 0) {
            throw new Error('No addresses found in addresses.txt');
        }
    } else if (sendMode.toLowerCase() === 'random') {
        const count = parseInt(promptUser('How many random addresses to generate? '), 10);
        if (isNaN(count) || count <= 0) {
            throw new Error('Invalid number of addresses');
        }
        addresses = generateRandomAddresses(count);
    } else {
        throw new Error('Invalid mode selected. Choose "random" or "specific".');
    }

    // Function to send transactions with retries
    async function sendTransactions() {
        let successCount = 0;

        for (let accountIndex = 0; accountIndex < privateKeys.length; accountIndex++) {
            const privateKey = privateKeys[accountIndex];
            const provider = new ethers.JsonRpcProvider(RPC_URL);
            const wallet = new ethers.Wallet(privateKey, provider);

            console.log(chalk.yellowBright(`Processing with account ${accountIndex + 1}/${privateKeys.length}`));

            for (const recipient of addresses) {
                // Basic validation for Ethereum addresses
                if (!ethers.isAddress(recipient)) {
                    log('ERROR', `Invalid address: ${recipient}`);
                    continue;
                }

                let retryCount = 0;
                const maxRetries = 7;

                while (retryCount < maxRetries) {
                    try {
                        // Generate a random amount for this transaction
                        const sendAmount = getRandomAmount(minAmount, maxAmount);

                        // Create the transaction
                        const feeData = await provider.getFeeData();
                        const tx = {
                            to: recipient,
                            maxFeePerGas: feeData.maxFeePerGas,
                            maxPriorityFeePerGas: feeData.maxPriorityFeePerGas,
                            gasLimit: 33000,
                            value: sendAmount,
                            nonce: await provider.getTransactionCount(wallet.address)
                        };

                        // Send the transaction
                        const txResponse = await wallet.sendTransaction(tx);

                        successCount++;
                        log('SUCCESS', `Transaction ${successCount} with hash: ${txResponse.hash}`);
                        break; // Exit retry loop on success
                    } catch (error) {
                        retryCount++;
                        let errorMessage = error.message;
                        if (error.code === 'INSUFFICIENT_FUNDS') {
                            errorMessage = 'INSUFFICIENT_FUNDS';
                        }
                        if (error.code === 'SERVER_ERROR') {
                            errorMessage = 'Service Temporarily Unavailable';
                        }
                        log('ERROR', `Error sending transaction to ${recipient}: ${errorMessage}`);
                        await delay(5000); // Wait before retrying
                    }
                }

                await delay(5000); // Delay between transactions
            }
        }
    }

    sendTransactions().catch(console.error);
}

main();