/*
Author: Iamwaxy
Date Created: July 25, 2021
Purpose: For claiming daily rewards
*/

const profileModel = require('../models/profileSchema');

module.exports = 
{
    name: 'streak',
    aliases: ['daily'],
    permissions: [],
    description: "To check daily reward. Syntax: >streak",
    async execute(client, message, args, discord, profileData)
    {
        if(!profileData)
        {
            return message.channel.send("ERROR: Account not found");
        }

        //const randomNumber = Math.floor(Math.random() * 500) + 1; //generate random amount between 1 and 500

        if(profileData.daily) //if daily reward is available
        {
            var reward = 500 + 200*profileData.streak;
            const response = await profileModel.findOneAndUpdate(
            {
                userID: message.author.id,
            }, 
            {
                $inc: {
                    coins: reward,
                    streak: 1,
                },
                daily: false,
            }
            );
            return message.channel.send(`${message.author.username}'s streak is ${profileData.streak}. Today's reward is ${reward} coins`)
        }
        else //otherwise tell user they must wait
        {
            return message.channel.send(`Sorry, today's daily reward has already been claimed. Daily rewards are reset at 8AM HKST (8PM EST) ${message.author.username}'s streak is ${profileData.streak}`)
        }
    },
};