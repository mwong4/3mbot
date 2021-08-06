/*
Author: Iamwaxy
Date Created: July 24, 2021
Purpose: For admins to checking wallet and bank balance
*/

const profileModel = require('../models/profileSchema'); //get models
const itemModel = require('../models/itemSchema');

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

            return message.channel.send(newEmbed); //Send embed
        }
        catch(err)
        {
            console.log(err);
        }
    }
};