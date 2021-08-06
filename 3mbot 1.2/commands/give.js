/*
Author: Iamwaxy
Date Created: July 23, 2021
Purpose: As admin, giving coins

Follow Tutorials: CodeLyon
*/

const profileModel = require('../models/profileSchema');
const itemModel = require('../models/itemSchema');

module.exports = 
{
    name: 'give',
    aliases: [],
    permissions: ["ADMINISTRATOR"],
    description: "As admin, ability to give coins. Syntax: >give #quantity/itemName @user",

    async execute(client, message, args, discord, profileData)
    {
        if(!args.length) return message.channel.send('ERROR: Missing mention player'); //Make sure person is mentioned

        const amount = args[0];
        const target = message.mentions.users.first();
        if(!target) return message.channel.send("ERROR: user does not exist");

        if(Number.isNaN(+amount))
        {
            try
            {
                const itemData = await itemModel.findOne({name: amount}); //Get item

                if(itemData)
                {

                    const responseOne = await itemModel.findOneAndUpdate( //Add to number sold on item
                    {
                        name: amount,
                    }, 
                    {
                        $inc: {
                            numberSold: 1,
                        },
                    }
                    );

                    const responseTwo = await profileModel.findOneAndUpdate( //Add to inventory
                    {
                        userID: target.id,
                    }, 
                    {
                        $push: {
                            inventory: amount,
                        },
                    }
                    );
                    return message.channel.send(`${amount} was given to ${target.username}`)
                }
                else
                {
                    return message.channel.send(`ERROR: ${amount} is not a valid item`);
                }
            }
            catch(err)
            {
                console.log(err);
            }
        }
        else
        {
            if(amount % 1 != 0 || amount <= 0) return message.channel.send('ERROR: Amount must be a positive whole number (command syntax may be wrong)'); //make sure input is not negative and is whole first
        
            try
            {   
                const targetData = await profileModel.findOne({userID: target.id}); //find target in database
                if(!targetData) return message.channel.send(`ERROR: User does not exist in database`); //make sure user is in database
    
                const responseThree = await profileModel.findOneAndUpdate(
                {
                    userID: target.id,
                }, 
                {
                    $inc: {
                        coins: amount,
                    },
                }
                );
                return message.channel.send(`Successfully gave ${amount} to **${target}**`); //tell user of success
            }
            catch(err)
            {
                console.log(err);
            }
        }
    },
};