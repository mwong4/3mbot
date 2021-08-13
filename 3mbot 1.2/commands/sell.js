/*
Author: Iamwaxy
Date Created: Aug 13, 2021
Purpose: To purchase items

Used tutorial for confirmation: https://www.codegrepper.com/code-examples/javascript/discord.js+await+message
*/

const profileModel = require('../models/profileSchema'); //get models
const itemModel = require('../models/itemSchema');

//Function for updating purchase in DB
async function updateProfile(_message, _price, _objectName)
{
    //Give coins
    const responseOne = await profileModel.findOneAndUpdate(
    {
        userID: _message.author.id,
    }, 
    {
        $inc: {coins: _price,},
    }
    );

    //Remove item
    const responseTwo = await profileModel.findOneAndUpdate(
    {
        userID: _message.author.id,
        inventory: _objectName,
    }, 
    {
        $set: { "inventory.$" : null},
    }
    );
    const responseThree = await profileModel.findOneAndUpdate( //Remove any null figures in inventory
    {
        userID: _message.author.id,
    }, 
    {
        $pull: {
            inventory: null,
        },
    }
    );
}

module.exports = 
{
    name: 'sell',
    aliases: [],
    permissions: [],
    description: "Sell item to bot. Syntax: >sell objectName",
    async execute(client, message, args, Discord, profileData)
    {
        const objectName = args[0]; //Make sure there is a name inputed

        try
        {
            if(!objectName) //This is for showing catalogue
            {
                return message.channel.send("ERROR: Object's Name is not specified"); //Send embed
            }
            else //To purchase item
            {
                if(!profileData) return message.channel.send("ERROR: No account found in database");
    
                var targetData = await itemModel.findOne({name: objectName}); //find target in database
                if(!targetData) return message.channel.send(`${objectName} is not a valid object`);

                if(profileData.inventory.includes(objectName))
                {
                    const price = targetData.averageValue * 0.5;

                    //Get confirmation
                    let filter = m => m.author.id === message.author.id
                    message.channel.send(`[LEVEL: 1] You will sell to the bot for ${price} coins. Please reply with <YES> to confirm. This message will expire in 30 seconds`).then(() => {
                      message.channel.awaitMessages(filter, {
                          max: 1,
                          time: 30000,
                          errors: ['time']
                        })
                        .then(message => {
                            message = message.first()
                            if (message.content.toUpperCase() == 'YES' || message.content.toUpperCase() == 'Y') 
                            {
                                updateProfile(message, price, objectName); //Call function to update DB

                                return message.channel.send(`Sold ${objectName} for ${price} coins`);
                            } 
                            else if (message.content.toUpperCase() == 'NO' || message.content.toUpperCase() == 'N') 
                            {
                                return message.channel.send(`Terminated`)
                            } 
                            else 
                            {
                                return message.channel.send(`Terminated: Invalid Response`)
                            }
                        })
                        .catch(collected => {
                            message.channel.send('ERROR: Timeout');
                        });
                    })
                }
                else
                {
                    return message.channel.send("ERROR: You do not own an item with this name"); //Make sure user has this item
                }
            }
        }
        catch(err)
        {
            console.log(err);
        }
    },
};