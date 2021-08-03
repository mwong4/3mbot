/*
Author: Iamwaxy
Date Created: Aug 2, 2021
Purpose: To Add an item to the database
*/

const itemModel = require('../models/itemSchema'); //get model

module.exports = 
{
    name: 'addItem',
    aliases: ["additem", "add"],
    permissions: ["ADMINISTRATOR"],
    description: "To add a valid item. Syntax: >addItem name  averageValue  tradeable (true, false)  tier (ie common, rare, etc)  description",
    async execute(client, message, args, Discord, profileData)
    {
        if(args.length < 4) return message.channel.send("ERROR: Missing arguments"); //Make sure enough arguments provided

        const averageValue = args[1];

        //Convert string to bool
        if(args[2] === "true") tradeable = true;
        else if(args[2] === "false") tradeable = false;
        else return message.channel.send("ERROR: [tradeable] is not a boolean (ie, true, false)");

        const description = args.splice(4, args.length).join(" "); //get all strings after (including) 4 and join into 1

        if(averageValue % 1 != 0 || averageValue < 0) return message.channel.send('ERROR: Average Value must be a positive whole number'); //make sure input is not negative and is whole first

        try
        {
            const targetData = await itemModel.findOne({name: args[0]}); //find target in database

            if(!targetData) //if profile does not exist
            {
                let item = await itemModel.create({ //make profile
                    name: args[0],
                    description: description,
                    numberSold: 0,
                    averageValue: averageValue,
                    tradeable: tradeable,
                    tier: args[3]
                });
                item.save(); //Save profile to database 
                return message.channel.send(`${args[0]} created`);
            }
            else //if it does exist
            {
                return message.channel.send(`ERROR: Item called: ${args[0]} already exists`);
            }
        }
        catch(err) //catch and output errors
        {
            console.log(err);
        }
    },
};