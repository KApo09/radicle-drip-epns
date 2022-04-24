const apiUrl = "https://api.thegraph.com/subgraphs/name/gh0stwheel/drips-on-rinkeby";
//const NotificationHelper = require ('@epnsproject/backend-sdk-staging').default;
const schedule = require('node-schedule');
const fetch = require("node-fetch");
const EpnsSDK = require("@epnsproject/backend-sdk-staging").default;
const utils = require('ethers').utils;

const CHANNEL_PK = "0xd1d8292c9bf014476c3c58cc45df582cf4a8fb10ed706bf7761db56b1d3f4dd7";
// const CHANNEL_PK = process.env.PK; // the private key of the channel
const CTA = "https://github.com/ethereum-push-notification-service"; // the link to be used as your cta


schedule.scheduleJob('*/10 * * * * *', async function () {

  let dai = await getDripsBySender("0xb5bb9a125c2f67f1f2cd9d8992955bb209490afe");
  let currentAccountValue = 0.000000192907772125

  let randomNum = Math.floor(Math.random()*10)
  if(randomNum > 5) {
    currentAccountValue += 1
    EPNS(currentAccountValue);
  }
});


async function EPNS(dai){
        
    const epnsSdk = new EpnsSDK(CHANNEL_PK);
    const pushNotificationTitle = "Welcome"; //the title which would appear in a push notification, usually could be a shorter version of the actual message
    const pushNotificationBody = "Your balance in DAI is: "; //the body which would be displayed in a push notification, usually could be a shorter version of the actual message
  
    const notificationTitle = "Your balance in DAI is: " + dai; //the long version of the title which would be displayed in the dApp
    const notificationBody = "Welcome to EPNS, we are glad to have you on board"; // the long version of the body which would be displayed in the dApp
    // TODO: change notification title and body to suite needs
  
    // TODO: change recipient address to the address you wish to use to recieve notifications
    const recipientAddress = "0xeD567297Ad6c93bcae8B4ffAB16dBE13D9d5048A";

    const notificationType = 3; // a notification type of 3, means the notification is a direct message to the specified recipient
    // send the actual notification
    const response = await epnsSdk.sendNotification(
      recipientAddress, //the recipients of the notification
      pushNotificationTitle, // push notification title
      pushNotificationBody, //push notification body
      notificationTitle, //the title of the notification
      notificationBody, //the body of the notification //the CTA of the notification, the link which should be redirected to when they click on the notification
      notificationType,
      CTA);
  
    console.log({
      response,
      message: "Your notification has been sucesfully sent"
    });

 }

async function getDripsBySender(address) {
   const emptyConfig = {
     balance: '0',
     timestamp: '0',
     receivers: [],
     withdrawable: () => '0'
   }
   try {
     // fetch...
     const resp = await query({ query: queryDripsConfigByID, variables: { id: address } })
  //   console.log(apiUrl)
    const wei = resp.data?.dripsConfigs[0].balance;
     const dai = utils.formatEther(wei);
     console.log("dai balance is : " + dai);
     console.log("Your Balance in DAI is: " + resp.data.dripsConfigs[0].balance);
//     console.log('query response ' + JSON.stringify(resp))
//    const config = resp.data?.dripsConfigs[0].balance;
     // if (config) {
     //   config.withdrawable = () => getDripsWithdrawable(config)
     // }
     return dai || emptyConfig
   } catch (e) {
     console.error(e)
     throw e
   }

   
 }

  async function query( {query, variables} ) {
    const id = btoa(JSON.stringify({ query, variables }))
    try {
      if (!apiUrl) {
        throw new Error('API URL missing')
      }
  
  //   console.log('query --> ' + JSON.stringify({ query, variables }))
      const resp = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query, variables })
      })
  
      if (resp.status >= 200 && resp.status <= 299) {
        const data = await resp.json()
  
        return data
      } else {
        throw Error(resp.statusText)
      }
    } catch (e) {
      console.error(e)
      sessionStorage.removeItem(id)
      throw new Error('API Error')
    }
  }

  const queryDripsConfigByID = ` query ($id: ID!) {
   dripsConfigs (where: {id: $id}, first: 1) {
     id
     balance
     timestamp: lastUpdatedBlockTimestamp
     receivers: dripsEntries {
       receiver
       amtPerSec
     }
   }
 }
 `


 //getDripsBySender("0xb5bb9a125c2f67f1f2cd9d8992955bb209490afe");