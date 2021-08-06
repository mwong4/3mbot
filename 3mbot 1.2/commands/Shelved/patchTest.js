/*
Author: Iamwaxy
Date Created: Aug 6, 2021
Purpose: To test adding field to database
*/

const profileModel = require('../models/profileSchema'); //Get model

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
            await profileModel.updateMany( //add date as field
            {
            
            },
            {
                $set: {boosterTime: 0},
                multi: true,
            },
            );

            await profileModel.updateMany( //remove field (field must be in schema)
            {
            
            },
            {
                $unset: { boostReward: "" },
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