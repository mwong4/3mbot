/*
Author: Iamwaxy
Date Created: July 20, 2021
Purpose: For banning

Follow Tutorials: CodeLyon
*/

module.exports = {
    name: 'ban',
    permissions: ["BAN_MEMBERS"],
    description: "For banning member. Syntax: >ban @User",
    execute(client, message, args)
    {
        const member = message.mentions.users.first();

        //Checking by id
        if(message.member.roles.cache.has('866306383658221628')) //If member has correct credentials
        {
            if(member) //make sure member mentioned
            {
                const memberTarget = message.guild.members.cache.get(member.id); //get id
                memberTarget.ban();
                message.channel.send(`<@${memberTarget.user.id}> has been banned`);
            }
            else
            {
                message.channel.send("ERROR: No player mentioned");
            }
        }
        else
        {
            message.channel.send('ERROR: Mod Permissions Required to ban'); //Send permission error
        }
    }
}