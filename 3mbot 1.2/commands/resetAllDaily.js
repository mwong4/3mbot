/*
Author: Iamwaxy
Date Created: July 28, 2021
Purpose: For resetting daily rewards accross all servers
*/

const profileModel = require('../models/profileSchema'); //get schema+model
require('dotenv').config(); //Requiring .env file

module.exports =
{
    name: 'updatealldaily',
    aliases: ['updatead', 'resetad'],
    permissions: ["ADMINISTRATOR"],
    description: "To reset daily rewards for ALL servers. Syntax: >updateAllDaily",

    async execute(client, message, args, discord, profileData)
    {
        if(message.author.id == process.env.IAMWAXY_ID) //Check if user is Iamwaxy
        {
            //reset all with daily still true
            await profileModel.updateMany(
            {
                daily: true,
            }, 
            {
                $set: {streak: 0},
            }
            );

            //reset all with daily as false
            await profileModel.updateMany(
            {
                daily: false,
            }, 
            {
                $set: {daily: true},
            }
            );

            return message.channel.send("Reset has completed successfully");
        }
        else
        {
            return message.channel.send("ERROR: Database Admin Permission Missing")
        }
    },
};