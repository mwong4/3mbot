/*
Author: Iamwaxy
Date Created: July 20, 2021
Purpose: For clearing messages from channel

Follow Tutorials: CodeLyon
NODE: only works for less than 14 days old messages
*/

module.exports = {
    name: 'clear',
    description: "For clearing messages",
    async execute(client, message, args)
    {
        let role = message.guild.roles.cache.find(r => r.name === "Mod");

        //Checking by id
        if(message.member.roles.cache.has('866306383658221628')) //If member has correct credentials
        {
            //Checking for illegal inputs
            if(!args[0]) return message.reply("ERROR: Missing quantity of lines to clear | example: >clear **42**");
            if(isNaN(args[0])) return message.reply("ERROR: First argument is not a number | example: >clear **42**");

            if(args[0] > 100) return message.reply("ERROR: Cannot clear more than 100 lines");
            if(args[0] < 1) return message.reply("ERROR: Please specify an argument greater than 0");
            if(Math.round(args[0]) != args[0]) return message.reply("ERROR: Please specify an integer (no decimals)");

            //Ok, all good now. Ready to clear
            await message.channel.messages.fetch({limit: args[0]}).then(messages =>{
                message.channel.bulkDelete(messages);
            });
        }
        else
        {
            message.channel.send('ERROR: Mod Permissions Required to mass clear'); //Send permission error
        }
    }
}