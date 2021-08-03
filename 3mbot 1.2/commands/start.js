/*
Author: Iamwaxy
Date Created: July 25, 2021
Purpose: To Start Account
*/

const profileModel = require('../models/profileSchema'); //get schema+model

module.exports = 
{
    name: 'start',
    aliases: [],
    permissions: [],
    description: "To start account used to get rewards and play games. Syntax: >start",
    async execute(client, message, args, Discord, profileData)
    {
        try
        {
            if(!profileData) //if profile does not exist
            {
                let profile = await profileModel.create({ //make profile
                    userID: message.author.id,
                    serverID: message.guild.id,
                    streak: 0,
                    daily: true,
                    coins: 1000,
                    bank: 0,
                    boostReward: false,
                    inventory: []
                });
                profile.save(); //Save profile to database
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