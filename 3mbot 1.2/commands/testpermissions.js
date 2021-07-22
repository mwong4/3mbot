/*
Author: Iamwaxy
Date Created: July 18, 2021
Purpose: Testing permission code

Follow Tutorials: CodeLyon
*/

module.exports = 
{
    name: 'testpermissions',
    aliases: ['testperms', 'permstest'],
    description: "test permissions",
    execute(client, message, args)
    {
        let role = message.guild.roles.cache.find(r => r.name === "Mod");

        //Checking by id
        if(message.member.roles.cache.has('866306383658221628')) //If member has correct credentials
        {
            message.channel.send('https://www.youtube.com/watch?v=Qik6A7UAGfk'); //Send 'ping' in channel
        }
        else
        {
            message.channel.send('ERROR: Mod Permissions Required'); //Send 'ping' in channel
            //message.member.roles.add('866306383658221628').catch(console.error); //add, remove
        }
        
        /*
        //Checking by name instead of id

        if(message.member.roles.cache.some(r => r.name === "Mod")) //If member has correct role name
        {
            message.channel.send('https://www.youtube.com/watch?v=Qik6A7UAGfk'); //Send 'ping' in channel
        }
        else
        {
            message.channel.send('ERROR: Mod Permissions Required. Adding to Mod...'); //Send 'ping' in channel
            message.member.roles.add(role).catch(console.error);
        }
        */

        /*
        //Checking specific permissions
        if(message.member.permissions.has("KICK_MEMBERS"))
        {
            message.channel.send('You have permission to kick members');
        }
        else
        {
            message.channel.send('You DONT have permission to kick');
        }
        */
    },
};