/*
Author: Iamwaxy
Date Created: July 17, 2021
Purpose: ping test command

Follow Tutorials: CodeLyon
Discord-buttons: https://discord-buttons.js.org/docs/stable/#welcome
Button tutorial: https://www.youtube.com/watch?v=09AyvuAW-wU
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

        const code1 = (Math.random()).toString();
        const code2 = (Math.random()).toString();

        const button1 = new MessageButton() //Yes button
            .setStyle('green')
            .setLabel('YES')
            .setID(code1);

        const button2 = new MessageButton() //No button
            .setStyle('red')
            .setLabel('NO')
            .setID(code2);

        
        //Send buttons out
        message.channel.send('Click this button to get a response!', {
            buttons: [button1, button2],
        });

        //On button input
        client.on('clickButton', async(button) => {
            if(message.author.id === button.clicker.id) //Respond only to target
            {
                if(button.id === code1)
                {
                    console.log("YES input");
                }
    
                const response = button.id;
    
                //Delete buttons
                await message.channel.messages.fetch({limit: 1}).then(messages =>{
                    message.channel.bulkDelete(messages);
                });
    
                button.channel.send(`Input Recieved: ${response}`); //Send output/response
    
                await button.reply.defer();
            }
            else
            {
                return;
            }
        });
    },
};