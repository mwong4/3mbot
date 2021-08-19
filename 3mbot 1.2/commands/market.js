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
            if(filter === "mine")
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

                        newEmbed.addField(`(${type}) event #${counter} (<-- code)`, `${event.items} ~$${value}`);
                    }
                    counter ++; //increase counter
                }
                else
                {
                    newEmbed.setDescription("Sorry, you have no listed items"); //If no event, print result
                }

                return message.channel.send(newEmbed); //Send embed
            }
        }
        catch(err) //catch and output errors
        {
            console.log(err);
        }
    },
};