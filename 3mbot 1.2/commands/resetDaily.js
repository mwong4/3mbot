/*
Author: Iamwaxy
Date Created: July 27, 2021
Purpose: For resetting daily rewards in the local server
*/

const profileModel = require('../models/profileSchema'); //get schema+model
require('dotenv').config(); //Requiring .env file

module.exports =
{
    name: 'updatedaily',
    aliases: ['resetdaily'],
    permissions: ["ADMINISTRATOR"],
    description: "To manualy reset daily rewards. Syntax: >updateDaily",

    async execute(client, message, args, discord, profileData)
    {

        const list = client.guilds.cache.get(message.guild.id);
        const filteredList = []; //List of all non bot members

        list.members.cache.forEach(member => { //get all members and save into an array
            if(!member.user.bot)
            {
                filteredList.push(member.user.id);
            }
        });

        for(const person in filteredList) //Go through array
        {
            const targetData = await profileModel.findOne({userID: filteredList[person]}); //find target in database

            if(targetData) //If target is in the database
            {
                if(targetData.daily) //reset streak if daily is not claimed yet
                {
                    const response = await profileModel.findOneAndUpdate(
                    {
                        userID: filteredList[person],
                    }, 
                    {
                        streak: 0,
                    }
                    );
                }
                else
                {
                    const response = await profileModel.findOneAndUpdate(
                    {
                        userID: filteredList[person],
                    }, 
                    {
                        daily: true,
                    }
                    );
                }
            }
        }
        return message.channel.send("Reset has completed successfully");
    },
};

