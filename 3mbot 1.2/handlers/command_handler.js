/*
Author: Iamwaxy
Date Created: July 17, 2021
Purpose: Handles Commands

Follow Tutorials: CodeLyon
*/

const fs = require('fs');

module.exports = (client, Discord) => {
    const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));

    for(const file of commandFiles) //Loop through commands
    {
        const command = require(`../commands/${file}`); //Save commands from file to main
        if(command.name) //if there is a name which exists, execute?
        {
            client.commands.set(command.name, command);
        }
        else
        {
            continue;
        }
    }
}