/*
Author: Iamwaxy
Date Created: July 24, 2021
Purpose: For admins to checking wallet and bank balance

Follow Tutorials: CodeLyon
*/

const profileModel = require('../models/profileSchema');

module.exports = 
{
    name: 'check',
    aliases: [],
    permissions: ["ADMINISTRATOR"],
    description: "For admins to check balance",
    async execute(client, message, args, Discord, profileData)
    {
        if(!args.length) return message.channel.send('ERROR: Missing mention player'); //Make sure person is mentioned

        const target = message.mentions.users.first();
        if(!target) return message.channel.send("ERROR: user does not exist");

        try
        {   
            const targetData = await profileModel.findOne({userID: target.id}); //find target in database
            if(!targetData) return message.channel.send(`ERROR: User does not exist in database`); //make sure user is in database

            const newEmbed = new Discord.MessageEmbed() //make embed
            .setTitle(`${target.username}'s Account`)
            .setColor('#2AD500')
            .addFields(
                {name: 'Wallet', value: targetData.coins},
                {name: 'Bank', value: targetData.bank}
            );

            return message.channel.send(newEmbed); //Send embed
        }
        catch(err)
        {
            console.log(err);
        }
    }
};