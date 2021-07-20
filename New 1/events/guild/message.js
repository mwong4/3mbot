/*
Author: Iamwaxy
Date Created: July 17, 2021
Purpose: Handle messages from user to bot

Follow Tutorials: CodeLyon
*/

require("dotenv").config();
const profileModel = require('../../models/profileSchema'); //get schema+model

module.exports = async(Discord, client, message) => {
    const prefix = process.env.PREFIX; //initialize prefix from .env

    if(!message.content.startsWith(prefix) || message.author.bot) return; //filter out non prefix or bot messages

    let profileData; //stores result of profile search
    try
    {
        profileData = await profileModel.findOne({ userID: message.author.id });

        if(!profileData) //if profile does not exist
        {
            console.log("Hi");
            let profile = await profileModel.create({ //make profile
                userID: message.author.id,
                serverID: message.guild.id,
                coins: 1000,
                bank: 0
            });
            profile.save(); //Save profile to database
        }
    }
    catch(err) //catch and output errors
    {
        console.log(err);
    }

    const args = message.content.slice(prefix.length).split(/ +/); //Splicing command
    const cmd = args.shift().toLowerCase();

    const command = client.commands.get(cmd);

    if(command) command.execute(client, message, args, Discord);
}