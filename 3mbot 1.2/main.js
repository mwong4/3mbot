/*
Author: Iamwaxy
Date Created: July 17, 2021
Purpose: Main file of 3mbot

Follow Tutorials: CodeLyon

TODO
-MarketWithdraw (take item out of auction)

-[Update] check (so that if auctioning, it will return data)
-Market (to browse auction) (page 1, page 2, etc...)

-Bid
-AuctionCollect (collect reward)

-Items w/ Image Support
-Bank Interest
-Bank Upgrade

-Implement ACTUAL item value
-Implement spreadsheet export
-Implement improved purchased product data tracking
*/ 

const fs = require('fs'); //Allow to acces other js files
const Discord = require('discord.js');
require('dotenv').config(); //Requiring .env file

const mongoose = require("mongoose");

const client = new Discord.Client();

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