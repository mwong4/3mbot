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
    description: "To see all valid items. Syntax: >inspectAll type (item, crate, write nothing for whole list)",
    async execute(client, message, args, Discord, profileData)
    {
        var type = args[0];

        try
        {
            var data = await itemModel.find({}); //By default, get all
            if(args[0]) //If argument specified, research query
            {
                data = await itemModel.find({objType: type});
            }
            else
            {
                type = "object";
            }
            
            const newEmbed = new Discord.MessageEmbed() //make embed
            .setTitle(`Valid ${type} list`)
            .setColor('#42bff5')

            if(args[0] === "crate") //If crate chosen, change color to purple
            {
                newEmbed.setColor('#e56bfa')
            }

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