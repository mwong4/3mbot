/*
Author: Iamwaxy
Date Created: July 17, 2021
Purpose: ping test command

Follow Tutorials: CodeLyon
*/

module.exports = 
{
    name: 'ping',
    description: "ping test command",
    execute(client, message, args)
    {
        message.channel.send('pong'); //Send 'ping' in channel
    },
};