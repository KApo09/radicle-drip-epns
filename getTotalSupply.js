// Configuration
var Contract = require('web3-eth-contract');
const abi = require('./abi.json');
const NotificationHelper = require ('@epnsproject/backend-sdk-staging').default;
const walletAddress = "0xAf5a26773f76af45bA658000B0B6e7C6deFE0e20";
Contract.setProvider('wss://kovan.infura.io/ws/v3/ff826bf159a146a0aa99c83be8bfe5ff');
const schedule = require('node-schedule');




schedule.scheduleJob('* */5 * * * *', async function () {
// Calling smart contract
var contract = new Contract(abi, walletAddress);
contract.methods.getTotalSupply().call().then(value => {
    // Sending notification
    // 1 - Channel configuration
    const walletKey = "2ddc16fed89ecb3dbef95146b91ca1d5954dece2c4e6064e373597e26c9b4506";
    const channelAddress = "0xe256760b2554AC5950a676cCF3455E4De6ab98aE";

    // 2 - EPNS SDK
    const sdk = new NotificationHelper(walletKey,
        {
            channelAddress: channelAddress
        });

    const payload = {
        type: 1, // Type of Notification
        notifTitle: "Number of NFTs", // Title of Notification
        notifMsg: `This contract has NFT ${value}`, // Message of Notification
        title: `This contract has NFT ${value}`, // Internal Title
        msg: `This contract has NFT ${value}`, // Internal Message
    };

    // 3 - Send notification
    sdk.sendNotification(channelAddress, payload.notifTitle, payload.notifMsg,
        payload.title, payload.msg, payload.type, false)
        .then(value => console.log(value))
        .catch(error => console.log(error));
});
});

