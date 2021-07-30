/*
Author: Iamwaxy
Date Created: July 30, 2021
Purpose: Give reward to booster
*/

require('dotenv').config(); //Requiring .env file

module.exports = 
{
    name: 'booster',
    aliases: ['boost'],
    permissions: [],
    description: "1 time reward for boosting. Syntax: >booster",

    execute(client, message, args, discord, profileData)
    {
        if(message.member.roles.cache.has(process.env.BOOSTER_TAG_ID) || message.guild.roles.cache.find(role => role.name === 'Server Booster')) //Checks to see if booster has boost tag
        {
            return message.channel.send("Thank you for boosting! You have recieved _____ as a gift!");
        }
        else
        {
            return message.channel.send("Sorry, this command is for boosters on the 3mber server only. Boost 3mber to get a gift now! (All accounts transferable)");
        }
    },
};
