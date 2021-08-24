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
    description: "To check your own balance. Syntax: >balance",
    execute(client, message, args, Discord, profileData)
    {
        if(!profileData)
        {
            return message.channel.send("ERROR: Account not found");
        }

        const newEmbed = new Discord.MessageEmbed() //make embed
            .setTitle(`${message.author.username}'s Account`)
            .setColor('#2AD500')
            .setDescription("Tip: Put money in bank to earn interest (extra money). Trade on the market **daily** to upgrade your interest plans")
            .addFields(
                {name: 'Wallet', value: `$${profileData.coins}`},
                {name: 'Bank', value: `$${profileData.bank} @ ${Math.floor(profileData.bankLevel)*2}% Interest [LEVEL ${Math.floor(profileData.bankLevel)}] (~${Math.round((profileData.bankLevel % 1)*100)}% TO LVL ${Math.floor(profileData.bankLevel) + 1})`}
            );

        message.channel.send(newEmbed); //Send embed

        //message.channel.send(`Your wallet balance: ${profileData.coins}, your bank balance: ${profileData.bank}`);
    }
};