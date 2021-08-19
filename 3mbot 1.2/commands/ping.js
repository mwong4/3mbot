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
        /*
        if(!isNaN(args[0])) return message.channel.send("Int");
        else return message.channel.send("not Int");
        */

        message.channel.send(args.splice(0, args.length).join(" ")); //Send 'ping' in channel
    },
};