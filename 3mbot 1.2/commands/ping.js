/*
Author: Iamwaxy
Date Created: July 17, 2021
Purpose: ping test command

Follow Tutorials: CodeLyon
*/

module.exports = 
{
    name: 'pingtest',
    aliases: ['ping', 'test'],
    permissions: [],
    description: "Ping test command. Syntax: >ping",
    async execute(client, message, args)
    {
        message.channel.send(args.splice(0, args.length).join(" ")); //Send 'ping' in channel
    },
};