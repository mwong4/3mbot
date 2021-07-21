/*
Author: Iamwaxy
Date Created: July 20, 2021
Purpose: For UNmuting people

Follow Tutorials: CodeLyon
*/

module.exports = {
    name: 'unmute',
    aliases: ['umt'],
    permissions: ["MANAGE_ROLES", "MUTE_MEMBERS"],
    description: "For unmuting members",
    execute(client, message, args)
    {
        const target = message.mentions.users.first(); //get FIRST member mentioned

        //Checking by id
        if(message.member.roles.cache.has('866306383658221628')) //If member has correct credentials
        {
            if(target) //Check if target was filled in
            {
                let mainRole = message.guild.roles.cache.find(role => role.name === 'Member') //get member role
                let muteRole = message.guild.roles.cache.find(role => role.name === 'Muted') //get member role

                let memberTarget = message.guild.members.cache.get(target.id); //get id from target

                memberTarget.roles.remove(muteRole.id); //unmute
                memberTarget.roles.add(mainRole.id);
                message.channel.send(`<@${memberTarget.user.id}> unmuted successfully`)
            }
            else
            {
                message.channel.send("ERROR: Target not specified"); //otherwise let user know
            }
        }
        else
        {
            message.channel.send('ERROR: Mod Permissions Required to unmute'); //Send permission error
        }
    }
}