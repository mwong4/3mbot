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

    const command = client.commands.get(cmd) || client.commands.find(a => a.aliases && a.aliases.includes(cmd)); //find command or alias

    //List of valid commands
    const validPermissions = [
        "CREATE_INSTANT_INVITE",
        "KICK_MEMBERS",
        "BAN_MEMBERS",
        "ADMINISTRATOR",
        "MANAGE_CHANNELS",
        "MANAGE_GUILD",
        "ADD_REACTIONS",
        "VIEW_AUDIT_LOG",
        "PRIORITY_SPEAKER",
        "STREAM",
        "VIEW_CHANNEL",
        "SEND_MESSAGES",
        "SEND_TTS_MESSAGES",
        "MANAGE_MESSAGES",
        "EMBED_LINKS",
        "ATTACH_FILES",
        "READ_MESSAGE_HISTORY",
        "MENTION_EVERYONE",
        "USE_EXTERNAL_EMOJIS",
        "VIEW_GUILD_INSIGHTS",
        "CONNECT",
        "SPEAK",
        "MUTE_MEMBERS",
        "DEAFEN_MEMBERS",
        "MOVE_MEMBERS",
        "USE_VAD",
        "CHANGE_NICKNAME",
        "MANAGE_NICKNAMES",
        "MANAGE_ROLES",
        "MANAGE_WEBHOOKS",
        "MANAGE_EMOJIS",
      ]   
      
    if(command.permissions.length) //If there is a perm inputted
    {
        let invalidPerms = []
        for(const perm of command.permissions)
        {
            if(!validPermissions.includes(perm)) //put a perm that does not exist (error trapping)
            {
                return console.log(`Invalid Permissions ${perm}`);
            }
            if(!message.member.hasPermission(perm)) //does not have perm
            {
                invalidPerms.push(perm);
            }
        }

        if(invalidPerms.length) //if there was an invalid perm
        {
            return message.channel.send(`Missing Permissions: \` ${invalidPerms}\``); //Tell user
        }
    }

    //Cooldown here

    if(command) command.execute(client, message, args, Discord, profileData);
}