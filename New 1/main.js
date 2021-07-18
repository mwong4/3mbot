/*
Author: Iamwaxy
Date Created: July 17, 2021
Purpose: Main file of 3mbot

Follow Tutorials: CodeLyon
*/

const fs = require('fs'); //Allow to acces other js files
const Discord = require('discord.js');
require('dotenv').config(); //Requiring .env file

const client = new Discord.Client();

client.commands = new Discord.Collection(); //command and event collections
client.events = new Discord.Collection();

//Execute command and event handlers
['command_handler', 'event_handler'].forEach(handler => {
    require(`./handlers/${handler}`)(client, Discord);
})


client.login(process.env.DISCORD_TOKEN); //Login token