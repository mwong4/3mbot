/*
Author: Iamwaxy
Date Created: July 23, 2021
Purpose: As admin, taking coins
*/

const profileModel = require('../models/profileSchema');

module.exports = 
{
    name: 'take',
    aliases: [],
    permissions: ["ADMINISTRATOR"],
    description: "As admin, ability to take coins or objects from members. Syntax: >take  #quantity/objectName  @user  location(ie bank, wallet. Not needed when taking objects)",

    async execute(client, message, args, discord, profileData)
    {
        if(!args.length) return message.channel.send('ERROR: Missing mention player'); //Make sure person is mentioned

        var amount = args[0];
        const target = message.mentions.users.first();
        const location = args[2]; //get location
        if(!target) return message.channel.send("ERROR: missing specified user");

        if(Number.isNaN(+amount))
        {
            try
            {
                const targetData = await profileModel.findOne({userID: target.id}); //find target in database
                if(!targetData) return message.channel.send(`ERROR: User does not exist in database`); //make sure user is in database

                if(targetData.inventory.includes(amount))
                {
                    const responseOne = await profileModel.findOneAndUpdate(
                    {
                        userID: target.id,
                        inventory: amount,
                    }, 
                    {
                        $set: { "inventory.$" : null},
                    }
                    );
                    const responseTwo = await profileModel.findOneAndUpdate(
                        {
                            userID: target.id,
                        }, 
                        {
                            $pull: {
                                inventory: null,
                            },
                        }
                        );
                }
                return message.channel.send(`${amount} has been removed from ${target.username}`)
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
    
                if(location == "wallet") //if wallet specified
                {
                    if(amount > targetData.coins) amount = targetData.coins; //if taking too much money, just zero account
                    const responseThree = await profileModel.findOneAndUpdate(
                    {
                        userID: target.id,
                    }, 
                    {
                        $inc: {
                            coins: -amount,
                        },
                    }
                    );
                    return message.channel.send(`Successfully took ${amount} from **${target}'s** ${location}`); //tell user of success
                }
                else if(location == "bank") //if bank specified
                {
                    if(amount > targetData.bank) amount = targetData.bank; //if taking too much money, just zero account
                    const responseFour = await profileModel.findOneAndUpdate(
                    {
                        userID: target.id,
                    }, 
                    {
                        $inc: {
                            bank: -amount,
                        },
                    }
                    );
                    return message.channel.send(`Successfully took ${amount} from **${target}'s** ${location}`); //tell user of success
                }
                else //if no location specified
                {
                    return message.channel.send("ERROR: Location unspecified or does not exist");
                }
            }
            catch(err)
            {
                console.log(err);
            }
        }        
    },
};