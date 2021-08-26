/*
Author: Iamwaxy
Date Created: July 17, 2021
Purpose: ping test command

Follow Tutorials: CodeLyon
*/

const { MessageButton } = require('discord-buttons');
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

        //message.channel.send(args.splice(0, args.length).join(" ")); //Send 'ping' in channel

        const button1 = new MessageButton()
            .setStyle('green')
            .setLabel('YES')
            .setID('button1');

        const button2 = new MessageButton()
            .setStyle('red')
            .setLabel('NO')
            .setID('button2');

        message.channel.send('Click this button to get a response!', {
            buttons: [button1, button2],
        });
    },
};