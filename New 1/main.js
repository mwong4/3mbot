/*
Author: Iamwaxy
Date Created: July 17, 2021
Purpose: Main file of 3mbot

Follow Tutorials: CodeLyon
*/

const fs = require('fs'); //Allow to acces other js files
const Discord = require('discord.js');
const prefix = '>';

const client = new Discord.Client();
client.commands = new Discord.Collection(); //collection of commands

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js')); //Give directory, filter .js only
for(const file of commandFiles) //Loop through commands
{
    const command = require(`./commands/${file}`); //Save commands from file to main

    client.commands.set(command.name, command);
}


//Run at start
client.once('ready', () => {
    console.log('3mbot is online'); //Indicate start in console
});

//Basic Command System
client.on('message', message => {
    if(!message.content.startsWith(prefix) || message.author.bot) return; //Ignore commands without prefix or made by bot

    const args = message.content.slice(prefix.length).split(/ +/); //Splicing
    const command = args.shift().toLowerCase();

    if(command === 'ping')
    {
        //message.channel.send('test2'); //Send 'ping' in channel
        //message.channel.send('test1'); //Send 'ping' in channel
        client.commands.get('ping').execute(message, args);
    }
});

client.login('ODA1OTc2Mzg2MjMzNjk2MzE2.YBiuAA.SzTkEd__ApAAb-9USoIJgtDyriY'); //Login token