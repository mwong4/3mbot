/*
Author: Iamwaxy
Date Created: Aug 18, 2021
Purpose: To see the listings of events on the market
*/

require('dotenv').config(); //Requiring .env file

const marketModel = require('../models/marketSchema'); //get model
const profileModel = require('../models/profileSchema'); //get models
const itemModel = require('../models/itemSchema');

module.exports = 
{
    name: 'market',
    aliases: ["m"],
    permissions: [],
    description: "To see listings on the market. Syntax: >market  filter(ie: mine, 1, 2, 3, crate, item)",
    async execute(client, message, args, Discord, profileData)
    {
        const filterWord = args[0]; //Get filter command

        try
        {
            if(!isNaN(filterWord)) //If filter is a number
            {
                var filterNum = Number(filterWord);
                if(filterNum % 1 != 0 || filterNum < 1) return message.channel.send("ERROR: Page number must be a positive whole number"); //Filter out negatives or decimals

                const data = await marketModel.find({}); //get all events

                if(data.length === 0)
                {
                    return message.channel.send("Sorry, market is currently empty");
                }

                //Check to see if filter is valid
                if(filterNum > (Math.ceil(data.length / 10)))
                {
                    filterNum = Math.ceil(data.length / 10);
                }

                const newEmbed = new Discord.MessageEmbed() //make embed
                .setTitle(`Market Page ${filterWord}`)
                .setColor('#D4FEE8')

                var top;
                var type;
                var value;

                if(data.length > filterNum*10) //Write description
                {
                    top = filterNum*10;
                }
                else
                {
                    top = data.length % 10
                }

                newEmbed.setDescription(`${filterNum*10-10}-${top} / ${data.length} Results`); //for page at top

                for(let i = ((filterNum*10)-10) ; i < top; i++)
                {
                    var winIndicator = "";

                    if(data[i].auction) //Check to see if it is auction or just selling
                    {
                        type = "auction";
                    }
                    else
                    {
                        type = "fixed price";
                    }

                    if(data[i].latestBid == 0) //Check to see if there are any bids yet
                    {
                        value = data[i].startingPrice;
                    }
                    else
                    {
                        value = data[i].latestBid;
                    }

                    if(data[i].latestBidID == message.author.id)
                    {
                        winIndicator = "(You are Winning)";
                    }

                    newEmbed.addField(`(${type}) event #${i} (<-- code) ${winIndicator}`, `[${data[i].items}] for ~$${value} (ending at ${data[i].expiryDate})  <Hex: ${data[i]._id}>`, false);
                }

                //Display filter in embed
                message.channel.send(newEmbed);

                //Get input for if person wants to bid
                let filter = m => m.author.id === message.author.id
                message.channel.send(`To bid or buy, please reply with: [ =select #eventCode ]. This message will expire in 5 minutes`).then(() => {
                    message.channel.awaitMessages(filter, {
                        max: 1,
                        time: 300000,
                        errors: ['time']
                    })
                    .then(message => {
                        message = message.first()
                        const segments = message.content.split(" ");
                        if (segments[0] != '=select') //If not a bid, terminate section
                        {
                            return message.channel.send(`Terminated`);
                        } 
                        else 
                        {
                            if(isNaN(segments[1])) return message.channel.send("Terminated: Code is not a number"); //Make sure input is number
                            if(Number(segments[1]) % 1 != 0 || Number(segments[1]) < 0) return message.channel.send("Terminated: Bid code is not a positive whole number");
                            if(Number(segments[1]) >= data.length) return message.channel.send(`Terminated: Code does not exist`);
                            
                            const objId = data[segments[1]]._id; //First get object unique id

                            //Else, process request
                            if(data[segments[1]].auction) //If auction
                            {
                                doubleCheckBid(objId);
                            }
                            else //otherwise use sell function
                            {
                                if(data[segments[1]].sellerID == message.author.id) return message.channel.send("ERROR: Cannot sell with yourself");

                                //Get confirmation
                                let filter = m => m.author.id === message.author.id
                                message.channel.send(`Paying ${data[segments[1]].startingPrice} for [${data[segments[1]].items}], please reply with <YES> to purchase. This message will expire in 30 seconds`).then(() => {
                                message.channel.awaitMessages(filter, {
                                    max: 1,
                                    time: 30000,
                                    errors: ['time']
                                    })
                                    .then(message => {
                                        message = message.first()
                                        if (message.content.toUpperCase() == 'YES' || message.content.toUpperCase() == 'Y') //When confirmed, call functions to run DB update 
                                        {
                                            updateStuffSell(objId);
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
                            }
                            return;
                        }
                    })
                    .catch(collected => {
                        message.channel.send('ERROR: Timeout');
                    });
                })

                async function updateStuffSell(_objId)
                {
                    //Make sure item is still on market
                    const data = await marketModel.findOne({_id: _objId}); //Get up to date data
                    if(!data) return message.channel.send("ERROR: Event is no longer on the market. Someone has purchased first");

                    //Make sure they have enough money
                    const personalData = await profileModel.findOne({userID: message.author.id});
                    if(personalData.coins < data.startingPrice) return message.channel.send(`ERROR: You do not have enough money ($${data.startingPrice})`);

                    //get seller data
                    const sellerData = await profileModel.findOne({userID: data.sellerID});

                    //Check expiry
                    const todayDate = new Date();
                    if(data.expiryDate.getTime() < todayDate.getTime()) return message.channel.send("ERROR: Item sale has expired");

                    var levelReward = 0;

                    //See if person elegible for xp reward
                    if(!personalData.dailyTrade)
                    {
                        levelReward = 0.04;  //<------ benefit per day
                    }

                    //Perform transaction
                    const responseOne = await profileModel.findOneAndUpdate( //remove money from person and give items
                    {
                        userID: message.author.id,
                    }, 
                    {
                        $inc: { 
                            coins: -data.startingPrice,
                            bankLevel: levelReward,
                        },
                        $push: {
                            inventory: { $each: data.items },
                        },
                        $set: { dailyTrade: true },
                    }
                    );

                    levelReward = 0;

                    //See if person elegible for xp reward
                    if(!sellerData.dailyTrade)
                    {
                        levelReward = 0.04;  //<------ benefit per day
                    }

                    const responseTwo = await profileModel.findOneAndUpdate( //give money to owner
                    {
                        userID: data.sellerID,
                    }, 
                    {
                        $inc: {
                            coins: data.startingPrice,
                            bankLevel: levelReward,
                        },
                        $set: { dailyTrade: true },
                    }
                    );

                    //remove market event
                    const responseThree = await marketModel.deleteOne(
                    {
                        _id: _objId,
                    }, 
                    );

                    //Update item data
                    for(const item of data.items)
                    {
                        const itemData = await itemModel.findOne({name: item});
                        const newAvg = Math.round(((data.startingPrice / data.items.length) + (itemData.averageValue*itemData.numberSold)) / (itemData.numberSold + 1))

                        const responseFour = await itemModel.findOneAndUpdate(
                        {
                            name: item,
                        }, 
                        {
                            $inc: {
                                numberSold : 1,
                            },
                            $set: {
                                averageValue: newAvg,
                            },
                        }
                        );
                    }

                    return message.channel.send(`Purchase complete of ${data.items}`);
                }

                async function doubleCheckBid(_objId)
                {
                    const dataDoubleCheck = await marketModel.findOne({_id: _objId}); //Get up to date data

                    if(dataDoubleCheck.sellerID == message.author.id) return message.channel.send("ERROR: Cannot bid with yourself");
                    
                    //Calculate new value
                    var cost;
                    if(dataDoubleCheck.latestBid === 0) cost = dataDoubleCheck.startingPrice;
                    else cost = dataDoubleCheck.latestBid;

                    //Calculate raise amount
                    var raiseAmount;
                    if(cost < 5000) raiseAmount = 500
                    else if(cost < 20000) raiseAmount = 1000;
                    else raiseAmount = 2500;

                    //Make sure date is good
                    const todayDate = new Date();
                    if(dataDoubleCheck.expiryDate.getTime() < todayDate.getTime()) return message.channel.send("ERROR: Auction has expired");
                    
                    //Make sure person has enough money
                    const personalData = await profileModel.findOne({userID: message.author.id});
                    if(personalData.coins < cost + raiseAmount) return message.channel.send(`ERROR: You do not have enough money (${cost + raiseAmount})`);

                    //Get other player's confirmation
                    let filter = m => m.author.id === message.author.id
                    message.channel.send(`Bidding ${cost + raiseAmount} (raised $${raiseAmount}) on [${dataDoubleCheck.items}], please reply with <YES> to confirm the PERMANENT bid. This message will expire in 30 seconds`).then(() => {
                    message.channel.awaitMessages(filter, {
                        max: 1,
                        time: 30000,
                        errors: ['time']
                        })
                        .then(message => {
                            message = message.first()
                            if (message.content.toUpperCase() == 'YES' || message.content.toUpperCase() == 'Y') //When confirmed, call functions to run DB update 
                            {
                                updateStuffBid(_objId, cost + raiseAmount);
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
                }

                async function updateStuffBid(_objId, _amount)
                {
                    const dataTripleCheck = await marketModel.findOne({_id: _objId}); //Get up to date data
                    const personalData = await profileModel.findOne({userID: message.author.id});

                    //Check Date
                    const todayDate = new Date();
                    if(dataTripleCheck.expiryDate.getTime() < todayDate.getTime()) return message.channel.send("ERROR: Auction has expired");

                    //Check transaction 1 more time
                    if(personalData.coins < _amount) return message.channel.send(`ERROR: You do not have enough money (${cost + raiseAmount})`);
                    
                    //Make sure that in the waiting time someone has not bid over user
                    if(_amount === dataTripleCheck.latestBid) return message.channel.send(`ERROR: Someone has bid over you. Use [ >bid ${_objId} ] to attempt again`);

                    //Now all good!
                    
                    if(dataTripleCheck.latestBid != 0) //Make sure not doing this to empty bid
                    {
                        //Give money back to prev bider
                        const responseOne = await profileModel.findOneAndUpdate(
                        {
                            userID: dataTripleCheck.latestBidID,
                        }, 
                        {
                            $inc: {
                                coins: dataTripleCheck.latestBid,
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
            else if(filterWord === "mine")
            {
                const data = await marketModel.find({sellerID: message.author.id}); //get all events listed under author's id

                const newEmbed = new Discord.MessageEmbed() //make embed
                .setTitle(`Your Listed Items`)
                .setColor('#D4FEE8')

                if(data)
                {
                    var counter = 1;

                    for(const event of data) //Go through each event
                    {
                        var type;
                        var value;

                        if(event.auction) //Check to see if it is auction or just selling
                        {
                            type = "auction";
                        }
                        else
                        {
                            type = "fixed price";
                        }

                        if(event.latestBid == 0) //Check to see if there are any bids yet
                        {
                            value = event.startingPrice;
                        }
                        else
                        {
                            value = event.latestBid;
                        }

                        newEmbed.addField(`(${type}) event #${counter} (<-- code)`, `${event.items} for ~$${value}  (ending at ${event.expiryDate})`, false);
                        counter ++; //increase counter
                    }
                    
                }
                else
                {
                    newEmbed.setDescription("Sorry, you have no listed items"); //If no event, print result
                }

                return message.channel.send(newEmbed); //Send embed
            }
            else //Filter is not a known command
            {
                return message.channel.send("ERROR: Filter is not valid");
            }
        }
        catch(err) //catch and output errors
        {
            console.log(err);
        }
    },
};