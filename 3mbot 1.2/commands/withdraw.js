/*
Author: Iamwaxy
Date Created: July 24, 2021
Purpose: To withdraw from bank

Follow Tutorials: CodeLyon
*/

const profileModel = require('../models/profileSchema');

module.exports = 
{
    name: 'withdraw',
    aliases: ['draw', 'wd'],
    permissions: [],
    description: "To take money out of bank",

    async execute(client, message, args, discord, profileData)
    {
        const amount = args[0];
        if(amount % 1 != 0 || amount <= 0) return message.channel.send('ERROR: Withdraw amount must be a positive whole number'); //make sure input is not negative and is whole first
        
        try
        {
            if(amount > profileData.bank) return message.channel.send(`ERROR: You don't have ${amount} coins in your bank`); //make sure they have that many coins in their wallet
            
            //All good, perform transfer
            await profileModel.findOneAndUpdate({
                userID: message.author.id
            }, {
                $inc: {
                    coins: amount,
                    bank: -amount,
                },
            }
            );

            return message.channel.send(`Successfully withdrawn ${amount} from bank`); //tell user of success
        }
        catch(err)
        {
            console.log(err);
        }

    },
};