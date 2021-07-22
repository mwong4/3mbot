/*
Author: Iamwaxy
Date Created: July 20, 2021
Purpose: For kicking

Follow Tutorials: CodeLyon
*/

module.exports = {
    name: 'kick',
    permissions: ["KICK_MEMBERS"],
    description: "For kicking member",
    execute(client, message, args)
    {
        const member = message.mentions.users.first(); //get FIRST member mentioned

        //Checking by id
        if(message.member.roles.cache.has('866306383658221628')) //If member has correct credentials
        {
            if(member) //make sure member mentioned
            {
                const memberTarget = message.guild.members.cache.get(member.id); //get id
                memberTarget.kick();
                message.channel.send(`<@${memberTarget.user.id}> has been kicked`);
            }
            else
            {
                message.channel.send("ERROR: No player mentioned");
            }
        }
        else
        {
            message.channel.send('ERROR: Mod Permissions Required to kick'); //Send permission error
        }
    }
}