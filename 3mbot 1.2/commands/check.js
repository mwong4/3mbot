/*
Author: Iamwaxy
Date Created: July 24, 2021
Purpose: For admins to checking wallet and bank balance
*/

const profileModel = require('../models/profileSchema'); //get models
const itemModel = require('../models/itemSchema');
const marketModel = require('../models/marketSchema');

module.exports = 
{
    name: 'check',
    aliases: [],
    permissions: ["ADMINISTRATOR"],
    description: "For admins to check balance. Syntax: >check @User",
    async execute(client, message, args, Discord, profileData)
    {
        if(!args.length) return message.channel.send('ERROR: Missing mention player'); //Make sure person is mentioned

        const target = message.mentions.users.first();
        if(!target) return message.channel.send("ERROR: user does not exist");

        try
        {   
            const targetData = await profileModel.findOne({userID: target.id}); //find target in database
            if(!targetData) return message.channel.send(`ERROR: User does not exist in database`); //make sure user is in database

            const newEmbed = new Discord.MessageEmbed() //make embed
            .setTitle(`${target.username}'s Account`)
            .setColor('#cc0a00')
            .addFields(
                {name: 'Wallet', value: targetData.coins},
                {name: 'Bank', value: targetData.bank}
            );

            for(const item of targetData.inventory) //Loop through all commands
            {
                var itemData = await itemModel.findOne({name: item}); //find target in database
    
                if(targetData) //If target exists
                {
                    newEmbed.addField(item, `[${itemData.tier}] (${itemData.objType})`, false); //add item and tier to embed
                }
            }

            const marketEmbed = new Discord.MessageEmbed()
            .setTitle(`${target.username}'s Market Events`)
            .setColor('#cc0a00')

            const marketData = await marketModel.find({sellerID: target.id});
            var counter = 0;

            if(marketData)
            {
                for(const event of marketData) //Go through each event
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

                    marketEmbed.addField(`(${type}) event=`, `${event.items} ~$${value}`);
                    counter ++;
                }
            }

            if(counter == 0)
            {
                marketEmbed.setDescription("This person has no market events");
            }

            message.channel.send(newEmbed); //Send embed
            return message.channel.send(marketEmbed);
        }
        catch(err)
        {
            console.log(err);
        }
    }
};