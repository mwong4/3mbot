/*
Author: Iamwaxy
Date Created: Aug 4, 2021
Purpose: To see all items owned by a user
*/

const profileModel = require('../models/profileSchema'); //get models
const itemModel = require('../models/itemSchema');

module.exports = 
{
    name: 'inventory',
    aliases: ["inv"],
    permissions: [],
    description: "See what items you own. Syntax: >inventory",
    async execute(client, message, args, Discord, profileData)
    {
        var counter = 0;

        try
        {
            if(!profileData)
            {
                return message.channel.send("ERROR: Account not found");
            }
    
            const newEmbed = new Discord.MessageEmbed() //make embed
            .setTitle(`${message.author.username}'s inventory`)
            .setColor('#42bff5')
    
            for(const item of profileData.inventory) //Loop through all commands
            {
                var targetData = await itemModel.findOne({name: item}); //find target in database
    
                if(targetData) //If target exists
                {
                    newEmbed.addField(item, `[${targetData.tier}] (${targetData.objType})`, false); //add item and tier to embed
                    counter ++; //Count # of items
                }
            }
            newEmbed.setDescription(`You have ${counter} items`);

            message.channel.send(newEmbed); //Send embed
        }
        catch(err)
        {
            console.log(err);
        }
    },
};