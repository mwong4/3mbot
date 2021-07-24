/*
Author: Iamwaxy
Date Created: July 23, 2021
Purpose: For checking bank and wallet balance

Follow Tutorials: CodeLyon
*/

module.exports = 
{
    name: 'balance',
    aliases: ['bal', 'bl'],
    permissions: [],
    description: "To check balance",
    execute(client, message, args, Discord, profileData)
    {
        const newEmbed = new Discord.MessageEmbed() //make embed
            .setTitle(`${message.author.username}'s Account`)
            .setColor('#2AD500')
            .addFields(
                {name: 'Wallet', value: profileData.coins},
                {name: 'Bank', value: profileData.bank}
            );

        message.channel.send(newEmbed); //Send embed

        //message.channel.send(`Your wallet balance: ${profileData.coins}, your bank balance: ${profileData.bank}`);
    }
};