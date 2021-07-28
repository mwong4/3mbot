/*
Author: Iamwaxy
Date Created: July 20, 2021
Purpose: For kicking

Follow Tutorials: CodeLyon
*/

module.exports = {
    name: 'kick',
    permissions: ["KICK_MEMBERS", "ADMINISTRATOR"],
    description: "For kicking member. Syntax: >kick @User",
    execute(client, message, args)
    {
        const member = message.mentions.users.first(); //get FIRST member mentioned

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
}