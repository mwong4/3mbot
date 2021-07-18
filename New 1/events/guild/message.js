/*
Author: Iamwaxy
Date Created: July 17, 2021
Purpose: Runs on start

Follow Tutorials: CodeLyon
*/

module.exports = (Discord, client, message) => {
    const prefix = process.env.PREFIX; //initialize prefix from .env

    if(!message.content.startsWith(prefix) || message.author.bot) return; //filter out non prefix or bot messages

    const args = message.content.slice(prefix.length).split(/ +/); //Splicing command
    const cmd = args.shift().toLowerCase();

    const command = client.commands.get(cmd);

    if(command) command.execute(client, message, args, Discord);
}