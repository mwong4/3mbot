/*
Author: Iamwaxy
Date Created: July 23, 2021
Purpose: For begging for coins

Follow Tutorials: CodeLyon
*/

const profileModel = require('../models/profileSchema');

module.exports = 
{
    name: 'beg',
    aliases: [],
    permissions: [],
    description: "To beg for coins. Syntax: >beg",
    async execute(client, message, args, discord, profileData)
    {
        if(!profileData)
        {
            return message.channel.send("ERROR: Account not found");
        }

        const randomNumber = Math.floor(Math.random() * 500) + 1; //generate random amount between 1 and 500
        const response = await profileModel.findOneAndUpdate(
        {
            userID: message.author.id,
        }, 
        {
            $inc: {
                coins: randomNumber,
            },
        }
        );
        return message.channel.send(`${message.author.username}, you recieved ${randomNumber} coins`)
    },
};