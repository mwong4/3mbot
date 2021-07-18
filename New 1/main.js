/*
Author: Iamwaxy
Date Created: July 17, 2021
Purpose: Main file of 3mbot

Follow Tutorials: CodeLyon
*/

const Discord = require('discord.js');
const client = new Discord.Client();

const prefix = '>';

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
        message.channel.send('pong');
    }
});

client.login('ODA1OTc2Mzg2MjMzNjk2MzE2.YBiuAA.SzTkEd__ApAAb-9USoIJgtDyriY'); //Login token