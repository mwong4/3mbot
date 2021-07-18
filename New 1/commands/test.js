/*
Author: Iamwaxy
Date Created: July 18, 2021
Purpose: Testing permission code

Follow Tutorials: CodeLyon
*/

module.exports = 
{
    name: 'test',
    description: "test permissions",
    execute(client, message, args)
    {
        if(message.member.roles.cache.has('866306383658221628')) //If member has correct credentials
        {
            message.channel.send('https://www.youtube.com/watch?v=Qik6A7UAGfk'); //Send 'ping' in channel
        }
        else
        {
            message.channel.send('ERROR: Mod Permissions Required'); //Send 'ping' in channel
        }
        
    },
};