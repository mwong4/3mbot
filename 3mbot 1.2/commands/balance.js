/*
Author: Iamwaxy
Date Created: July 23, 2021
Purpose: For checking bank balance

Follow Tutorials: CodeLyon
*/

module.exports = 
{
    name: 'balance',
    aliases: ['bal', 'bl'],
    permissions: [],
    description: "To check balance",
    execute(client, message, args, discord, profileData)
    {
        message.channel.send(`Your wallet balance: ${profileData.coins}, your bank balance: ${profileData.bank}`);
    }

};