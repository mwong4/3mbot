/*
Author: Iamwaxy
Date Created: July 24, 2021
Purpose: Shows list of commands
*/

const fs = require('fs');

module.exports = 
{
    name: 'help',
    aliases: [],
    permissions: [],
    description: "Shows all commands and their descriptions. Syntax: >help",

    execute(client, message, args, Discord, profileData)
    {
        const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js')); //Get all command files

        var normalEmbed = new Discord.MessageEmbed() //make a new embed
            .setTitle('Normal Commands')
            .setColor('#d99307');

        var adminEmbed = new Discord.MessageEmbed() //make a second new embed for admins
            .setTitle('Admin Commands')
            .setColor('#d99307');

        for(const file of commandFiles) //Loop through all commands
        {
            const command = require(`../commands/${file}`); //Save commands from file to main
            if(command.name) //if there is a name which exists
            {
                if(command.permissions.length) //If there are permissions
                {
                    adminEmbed.addField(command.name, command.description, false); //add to admin embed
                }
                else //otherwise, save to normal embed
                {
                    normalEmbed.addField(command.name, command.description, false);
                }
            }
            else
            {
                continue;
            }
        }
        message.channel.send(normalEmbed);
        return message.channel.send(adminEmbed); //Send Embeds
    }

};