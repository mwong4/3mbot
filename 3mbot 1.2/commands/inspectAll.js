/*
Author: Iamwaxy
Date Created: Aug 3, 2021
Purpose: To see all items in the database
*/

const itemModel = require('../models/itemSchema'); //get model

module.exports = 
{
    name: 'inspectAll',
    aliases: ["inspectall", "seeall"],
    permissions: ["ADMINISTRATOR"],
    description: "To see all valid items. Syntax: >inspectAll type (item, crate)",
    async execute(client, message, args, Discord, profileData)
    {
        const type = args[0];

        try
        {
            const data = await itemModel.find({objType: type});
            
            const newEmbed = new Discord.MessageEmbed() //make embed
            .setTitle("All Valid Items")
            .setColor('#42bff5')

            for(const obj of data)
            {
                newEmbed.addField(obj.name, `[${obj.tier}] (${obj.objType})`, false); //Add item to field
            }
            
            message.channel.send(newEmbed); //Send embed
            
        }
        catch(err)
        {
            console.log(err)
        }
    },
};