/*
Author: Iamwaxy
Date Created: July 20, 2021
Purpose: For banning

Follow Tutorials: CodeLyon
*/

module.exports = {
    name: 'ban',
    permissions: ["BAN_MEMBERS", "ADMINISTRATOR"],
    description: "For banning member. Syntax: >ban @User",
    execute(client, message, args)
    {
        const member = message.mentions.users.first();

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
}