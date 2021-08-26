/*
Author: Iamwaxy
Date Created: July 17, 2021
Purpose: Main file of 3mbot

Follow Tutorials: CodeLyon
Discord-buttons: https://discord-buttons.js.org/docs/stable/#welcome
Button tutorial: https://www.youtube.com/watch?v=09AyvuAW-wU

TODO
-Confirmation -> Buttons
-Buy

-Cancel
-Inventory/Inspect/Use
-Sell
-Trade


-Items w/ Image Support

-Implement spreadsheet export
-Implement ACTUAL item value
-cron error (Could not find)

-Implement improved purchased product data tracking
*/ 

//Essentiel Packages
const fs = require('fs'); //Allow to acces other js files
const Discord = require('discord.js');
const client = new Discord.Client();
const mongoose = require("mongoose");

//Other packages
require('dotenv').config(); //Requiring .env file
require('discord-buttons')(client);

client.commands = new Discord.Collection(); //command and event collections
client.events = new Discord.Collection();

//Guild member add event
client.on('guildMemberAdd', guildMember =>{
    let welcomeRole = guildMember.guild.roles.cache.find(role => role.name === 'Member');

    guildMember.roles.add(welcomeRole); //Add member role
    guildMember.guild.channels.cache.get('867453936021012540').send(`Welcome <@${guildMember.user.id}>`);
});

//Execute command and event handlers
['command_handler', 'event_handler'].forEach(handler => {
    require(`./handlers/${handler}`)(client, Discord);
});


//Connect to database through mongoose package
mongoose.connect(process.env.MONGODB_SRV, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(()=>{
    console.log('3mbot Database Connected'); //let us know connection
}).catch((err) => {
    console.log(err); //let us know error
});

client.login(process.env.DISCORD_TOKEN); //Login token