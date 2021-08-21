/*
Author: Iamwaxy
Date Created: Aug 20, 2021
Purpose: To see the listings of events on the market
*/

const marketModel = require('../models/marketSchema'); //get model

module.exports = 
{
    name: 'bid',
    aliases: [],
    permissions: [],
    description: "To bid on an auction event. Syntax: >bid  itemCode",
    async execute(client, message, args, Discord, profileData)
    {
        try
        {
            //Get other player's confirmation. Initiator can cancel
            let filter = m => m.author.id === message.author.id
            message.channel.send(`To bid on an auction, please reply with auction code. This message will expire in 60 seconds`).then(() => {
                message.channel.awaitMessages(filter, {
                    max: 1,
                    time: 60000,
                    errors: ['time']
                })
                .then(message => {
                    message = message.first()
                    message.channel.send(message.content);
                })
                .catch(collected => {
                    message.channel.send('ERROR: Timeout');
                });
            })
        }
        catch(err) //catch and output errors
        {
            console.log(err);
        }
    },
};