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

        //message.channel.send(args.splice(0, args.length).join(" ")); //Send 'ping' in channel

        /*

        const disbut = require("discord-buttons");

        let yesButton = new disbut.MessageButton()
        .setLabel("YES")
        .setID("id1")
        .setStyle("green");

        let noButton = new disbut.MessageButton()
        .setLabel("NO")
        .setID("id2")
        .setStyle("red");

        let row = new disbut.MessageActionRow()
        .addComponents(yesButton, noButton);

        message.channel.send("Message", row);

        client.on('clickButton', async (yesButton) => {
            message.channel.send("YES");
            noButton.disabled();
            yesButton.disabled();
        });


        client.on('clickButton', async (noButton) => {
            message.channel.send("NO");
            noButton.disabled();
            yesButton.disabled();
        });
        */

        

    },
};