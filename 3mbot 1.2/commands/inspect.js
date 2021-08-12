/*
Author: Iamwaxy
Date Created: Aug 4, 2021
Purpose: To see all items owned by a user
*/

const profileModel = require('../models/profileSchema'); //get models
const itemModel = require('../models/itemSchema');

module.exports = 
{
    name: 'inspect',
    aliases: ["ins"],
    permissions: [],
    description: "Inpsect an item more closely. Syntax: >inpsect itemName",
    async execute(client, message, args, Discord, profileData)
    {
        const input = args[0];
        try
        {
            var targetData = await itemModel.findOne({name: input}); //find target in database
            if(!targetData) return message.channel.send(`${input} is not a valid item`);

            const newEmbed = new Discord.MessageEmbed() //make embed
            .setTitle(`${input} [${targetData.tier}] (${targetData.objType})`)
            .setDescription("Use item with >use command");

            if(profileData || message.member.hasPermission("ADMINISTRATOR"))
            {
                if(message.member.hasPermission("ADMINISTRATOR") || profileData.inventory.includes(input)) //If user is admin or has item in inventory, show full detail
                {
                    newEmbed.addField("description", targetData.description, true);
                    newEmbed.addField("sold", targetData.numberSold, true);
                    newEmbed.addField("historical average value", targetData.averageValue, true);
                }
            }


            if(targetdata.objType  === "item")
            {
                newEmbed.setColor("#42bff5"); //Set to blue
            }
            else if(targetdata.objType === "crate")
            {
                const splitRates = targetData.rates.split(" ");

                newEmbed.setColor("#e56bfa"); //Set to purple
                newEmbed.addField("price", splitRates[0], true);
                newEmbed.addField("rates (Common, Unique, Rare, Legendary)", splitRates.slice(1).join(" "), true);
            }
            else
            {
                return message.channel.send("ERROR: Objtype not recognized");
            }
            newEmbed.addField("tradeable", targetData.tradeable, true); 
            message.channel.send(newEmbed); //Send embed
        }
        catch(err)
        {
            console.log(err);
        }
    },
};