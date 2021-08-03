/*
Author: Iamwaxy
Date Created: Aug 2, 2021
Purpose: To Add an item to the database
*/

const itemModel = require('../../models/itemSchema'); //get model

module.exports = 
{
    name: 'addItem',
    aliases: ["additem", "add"],
    permissions: ["ADMINISTRATOR"],
    description: "To add a valid item. Syntax: >addItem name description averageValue tradeable (bool) tier (ie common, rare, etc)",
    async execute(client, message, args, Discord, profileData)
    {
        try
        {
            if(!profileData) //if profile does not exist
            {
                let item = await itemModel.create({ //make profile
                    name: "test",
                    description: "just a test",
                    numberSold: 0,
                    averageValue: 0,
                    tradeable: true,
                    tier: "common"
                });
                item.save(); //Save profile to database 
                return message.channel.send(`Account for <@${message.author.username}> created`);
            }
            else
            {
                return message.channel.send(`Account for <@${message.author.username}> already exists`);
            }
        }
        catch(err) //catch and output errors
        {
            console.log(err);
        }
    },
};