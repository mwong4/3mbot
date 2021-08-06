/*
Author: Iamwaxy
Date Created: July 30, 2021
Purpose: Give reward to booster
*/

require('dotenv').config(); //Requiring .env file
const profileModel = require('../models/profileSchema');

module.exports = 
{
    name: 'booster',
    aliases: ['boost'],
    permissions: [],
    description: "1 time reward for boosting. Syntax: >booster",

    async execute(client, message, args, discord, profileData)
    {
        try
        {   
            const targetData = await profileModel.findOne({userID: message.author.id}); //find target in database
            if(!targetData) return message.channel.send(`ERROR: User does not exist in database. Make an account first`); //make sure user is in database

            if(message.member.roles.cache.has(process.env.BOOSTER_TAG_ID) || message.guild.roles.cache.find(role => role.name === 'Server Booster')) //Checks to see if booster has boost tag
            {
                var todayDate = new Date();
                var futureDate = new Date();
                futureDate.setHours(todayDate.getHours() + 6); //using ust time

                console.log(targetData.boosterTime.getTime());
                console.log(todayDate.getTime());

                if(targetData.boosterTime.getTime() < todayDate.getTime())
                {
                    const response = await profileModel.findOneAndUpdate(
                        {
                            userID: message.author.id,
                        }, 
                        {
                            $inc: 
                            {
                                coins: 2000,
                            },
                            $set: 
                            {
                                boosterTime: futureDate,
                            },
                        }
                        );
                    return message.channel.send(`Thank you ${message.author.username} for boosting! You have recieved _____ as a gift! Come back in 6 hours`);   
                }
                else
                {
                    return message.channel.send(`Sorry, reward has already been collected. come back at ${targetData.boosterTime}`);
                }
            }
            else
            {
                return message.channel.send("Sorry, this command is for boosters on the 3mber server only. Boost 3mber to get a gift now! (All rewards automatically transferable)");
            }
        }
        catch(err)
        {
            console.log(err);
        }
    },
};
