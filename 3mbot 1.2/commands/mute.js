/*
Author: Iamwaxy
Date Created: July 20, 2021
Purpose: For muting people

Follow Tutorials: CodeLyon
*/

const ms = require('ms'); //incldue ms package

module.exports = {
    name: 'mute',
    aliases: ['mt'],
    permissions: ["MANAGE_ROLES", "MUTE_MEMBERS", "ADMINISTRATOR"],
    description: "For muting members. Syntax: >mute @User",
    execute(client, message, args)
    {
        const target = message.mentions.users.first(); //get FIRST member mentioned

        if(target) //Check if target was filled in
        {
            let mainRole = message.guild.roles.cache.find(role => role.name === 'Member') //get member role
            let muteRole = message.guild.roles.cache.find(role => role.name === 'Muted') //get member role

            let memberTarget = message.guild.members.cache.get(target.id); //get id from target

            if(!args[1]) //if no second argument
            {
                memberTarget.roles.remove(mainRole.id); //mute
                memberTarget.roles.add(muteRole.id);
                message.channel.send(`<@${memberTarget.user.id}> muted successfully`)
                return;
            }
            else
            {
                memberTarget.roles.remove(mainRole.id); //mute
                memberTarget.roles.add(muteRole.id);
                message.channel.send(`<@${memberTarget.user.id}> muted successfully for ${ms(ms(args[1]))}`)
                
                setTimeout(function()
                {
                    memberTarget.roles.remove(muteRole.id); //unmute after timer
                    memberTarget.roles.add(mainRole.id);
                }, ms(args[1]))
            }

        }
        else
        {
            message.channel.send("ERROR: Target not specified"); //otherwise let user know
        }
    },
};