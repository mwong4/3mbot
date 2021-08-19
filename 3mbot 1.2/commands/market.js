/*
Author: Iamwaxy
Date Created: Aug 18, 2021
Purpose: To see the listings of events on the market
*/

const marketModel = require('../models/marketSchema'); //get model

module.exports = 
{
    name: 'market',
    aliases: ["m"],
    permissions: [],
    description: "To see listings on the market. Syntax: >market  filter(ie: mine, 1, 2, 3, crate, item)",
    async execute(client, message, args, Discord, profileData)
    {
        const filter = args[0]; //Get filter command

        try
        {
            if(!isNaN(filter)) //If filter is a number
            {
                var filterNum = Number(filter);
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
                .setTitle(`Market Page ${filter}`)
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

                    newEmbed.addField(`(${type}) event #${i} (<-- code)`, `${data[i].items} ~$${value}`, false);
                }

                //Display filter in embed
                return message.channel.send(newEmbed);
            }
            else if(filter === "mine")
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

                        newEmbed.addField(`(${type}) event #${counter} (<-- code)`, `${event.items} ~$${value}`, false);
                    }
                    counter ++; //increase counter
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