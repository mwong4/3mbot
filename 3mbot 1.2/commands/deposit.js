/*
Author: Iamwaxy
Date Created: July 24, 2021
Purpose: To desposit into bank

Follow Tutorials: CodeLyon
*/

const profileModel = require('../models/profileSchema');

module.exports = 
{
    name: 'deposit',
    aliases: ['dep', 'depo'],
    permissions: [],
    description: "To drop money into bank",

    async execute(client, message, args, discord, profileData)
    {
        const amount = args[0];
        if(amount % 1 != 0 || amount <= 0) return message.channel.send('ERROR: Deposit amount must be a positive whole number'); //make sure input is not negative and is whole first
        
        try
        {
            if(amount > profileData.coins) return message.channel.send(`ERROR: You don't have ${amount} coins in your wallet`); //make sure they have that many coins in their wallet
            
            //All good, perform transfer
            await profileModel.findOneAndUpdate({
                userID: message.author.id
            }, {
                $inc: {
                    coins: -amount,
                    bank: amount,
                },
            }
            );

            return message.channel.send(`Successfully deposited ${amount} to bank`); //tell user of success
        }
        catch(err)
        {
            console.log(err);
        }

    },
};