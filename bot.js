/*
//Script Information//
Author: Max Wong
Date Created: Feb 1, 2020
Purpose: To serve 3mber Discord server

//Sources//
Initial settup and basic command recognition: https://www.digitaltrends.com/gaming/how-to-make-a-discord-bot/
*/

var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
var promptChar = '>'; //This is the char used to prompt commands

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';

// Initialize Discord Bot
var bot = new Discord.Client({
   token: auth.token,
   autorun: true
});
bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});
bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with prompt given
    if (message.substring(0, 1) == promptChar) {
        var args = message.substring(1).split(' ');
        var cmd = args[0];
       
        args = args.splice(1);
        switch(cmd) {
            // !ping
            case 'ping':
                bot.sendMessage({
                    to: channelID,
                    message: 'Pong!'
                });
            break;
            case 'intro':
                bot.sendMessage({
                    to: channelID,
                    message: 'Hello World! Welcome all'
                });
            break;

            // Just add any case commands if you want to..
         }
     }
});