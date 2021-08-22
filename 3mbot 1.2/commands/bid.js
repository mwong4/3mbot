/*
Author: Iamwaxy
Date Created: Aug 20, 2021
Purpose: To see the listings of events on the market
*/

const marketModel = require('../models/marketSchema'); //get model
const profileModel = require('../models/profileSchema'); //get models

module.exports = 
{
    name: 'bid',
    aliases: [],
    permissions: [],
    description: "To bid on an auction event using the specific eventcode. Syntax: >bid  hexCode(ex: 6121a95b502f520bc42f051b)",
    async execute(client, message, args, Discord, profileData)
    {
        const objectId = args[0];

        try
        {
            //Get data
            const data = await marketModel.findOne({_id: objectId});
            if(!data) return message.channel.send("ERROR: Market event not found");

            //Make sure it is an auction
            if(!data.auction) return message.channel.send("ERROR: Event is not an auction");

            //Calculate new value
            var cost;
            if(data.latestBid === 0) cost = data.startingPrice;
            else cost = data.latestBid;

            //Calculate raise amount
            var raiseAmount;
            if(cost < 5000) raiseAmount = 500
            else if(cost < 20000) raiseAmount = 1000;
            else raiseAmount = 2500;
            
            //Display offer
            const newEmbed = new Discord.MessageEmbed() //make embed
            .setTitle(`Auction ${data._id}`)
            .setColor('#D4FEE8')
            .addField(`[${data.items}] for ~$${cost + raiseAmount}`, ` (ending at ${data.expiryDate})`, false);
            message.channel.send(newEmbed);

            //Make sure date is good
            const todayDate = new Date();
            if(data.expiryDate.getTime() < todayDate.getTime()) return message.channel.send("ERROR: Auction has expired");
            
            //Make sure person has enough money
            const personalData = await profileModel.findOne({userID: message.author.id});
            if(personalData.coins < cost + raiseAmount) return message.channel.send(`ERROR: You do not have enough money (${cost + raiseAmount})`);

            //Get other player's confirmation. Initiator can cancel
            let filter = m => m.author.id === message.author.id
            message.channel.send(`Bidding ${cost + raiseAmount} (raised $${raiseAmount}) on [${data.items}], please reply with <YES> to confirm the PERMANENT bid. This message will expire in 30 seconds`).then(() => {
            message.channel.awaitMessages(filter, {
                max: 1,
                time: 30000,
                errors: ['time']
                })
                .then(message => {
                    message = message.first()
                    if (message.content.toUpperCase() == 'YES' || message.content.toUpperCase() == 'Y') //When confirmed, call functions to run DB update 
                    {
                        updateStuff(objectId, cost + raiseAmount);
                        return;
                    } 
                    else if (message.content.toUpperCase() == 'NO' || message.content.toUpperCase() == 'N') 
                    {
                        return message.channel.send(`Terminated`);
                    } 
                    else 
                    {
                        return message.channel.send(`Terminated: Invalid Response`);
                    }
                })
                .catch(collected => {
                    message.channel.send('ERROR: Timeout');
                });
            })

            //For updating bid
            async function updateStuff(_objId, _amount)
            {
                const dataDoubleCheck = await marketModel.findOne({_id: _objId}); //Get up to date data
                const personalData = await profileModel.findOne({userID: message.author.id});

                //Check Date
                const todayDate = new Date();
                if(dataDoubleCheck.expiryDate.getTime() < todayDate.getTime()) return message.channel.send("ERROR: Auction has expired");

                //Check transaction 1 more time
                if(personalData.coins < _amount) return message.channel.send(`ERROR: You do not have enough money (${cost + raiseAmount})`);
                
                //Make sure that in the waiting time someone has not bid over user
                if(_amount === dataDoubleCheck.latestBid) return message.channel.send(`ERROR: Someone has bid over you. Use [ >bid ${_objId} ] to attempt again`);

                //Now all good!
                
                if(dataDoubleCheck.latestBid != 0) //Make sure not doing this to empty bid
                {
                    //Give money back to prev bider
                    const responseOne = await profileModel.findOneAndUpdate(
                    {
                        userID: dataDoubleCheck.latestBidID,
                    }, 
                    {
                        $inc: {
                            coins: dataDoubleCheck.latestBid,
                        },
                    }
                    );
                }

                //Take money from new bidder
                const responseTwo = await profileModel.findOneAndUpdate(
                {
                    userID: message.author.id,
                }, 
                {
                    $inc: {
                        coins: -_amount,
                    },
                }
                );
                //record money from new bidder into auction
                const responseThree = await marketModel.findOneAndUpdate(
                {
                    _id: _objId,
                }, 
                {
                    $set: {
                        latestBid: _amount,
                    },
                }
                );
                //record new bidder into auction
                const responseFour = await marketModel.findOneAndUpdate(
                {
                    _id: _objId,
                }, 
                {
                    $set: {
                        latestBidID: message.author.id,
                    },
                }
                );
                return message.channel.send("Bid submitted successfully");
            }
        }
        catch(err) //catch and output errors
        {
            console.log(err);
        }
    },
};