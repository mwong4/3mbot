/*
Author: Iamwaxy
Date Created: July 17, 2021
Purpose: Handles Events

Follow Tutorials: CodeLyon
*/

const fs = require('fs');

module.exports = (client, Discord) => {
    const loadDir = (dirs) =>{
        const eventFiles = fs.readdirSync(`./events/${dirs}`).filter(file => file.endsWith('.js')); //Making sure to read only .js files

        for(const file of eventFiles)
        {
            const event = require(`../events/${dirs}/${file}`); //Loop and enter all places
            const eventName = file.split('.')[0];
            client.on(eventName, event.bind(null, Discord, client));
        }
    }

    ['client', 'guild'].forEach(e => loadDir(e)); //Execute
}