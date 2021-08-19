/*
Author: Iamwaxy
Date Created: Aug 6, 2021
Purpose: To test adding field to database
*/

const profileModel = require('../models/profileSchema'); //Get model
const itemModel = require('../models/itemSchema');
const marketModel = require('../models/marketSchema');

module.exports = 
{
    name: 'patch',
    aliases: [],
    permissions: ["ADMINISTRATOR"],
    description: "To implement a patch to the database. Syntax: >patch",
    async execute(client, message, args)
    {
        try
        {
            /*
            await itemModel.updateMany( //add date as field
            {
            
            },
            {
                $set: {rates: "Test"},
                multi: true,
            },
            );
            */

            /*
            await profileModel.updateMany( //remove field (field must be in schema)
            {
            
            },
            {
                $unset: { boostReward: "" },
            },
            );
            */

            await marketModel.updateMany( //add date as field
            { },
            {
                $set: {completed: false},
                multi: true,
            },
            );

            return message.channel.send("Patch Installed");
        }
        catch(err)
        {
            console.log(err);
        }
    },
};