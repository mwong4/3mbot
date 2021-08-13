/*
Author: Iamwaxy
Date Created: Aug 13, 2021
Purpose: To purchase items
*/

const profileModel = require('../models/profileSchema'); //get models
const itemModel = require('../models/itemSchema');

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
                    const responseOne = await itemModel.findOneAndUpdate( //Increase number sold
                    {
                        name: objectName,
                    }, 
                    {
                        $inc: {
                            numberSold: 1,},
                    }
                    );

                    //Remove coins and add new item
                    const responseTwo = await profileModel.findOneAndUpdate(
                    {
                        userID: message.author.id,
                    }, 
                    {
                        $inc: {coins: -1*Number(splitRates[0]),},
                        $push: { inventory: objectName, },
                    }
                    );
                    
                    return message.channel.send(`Purchase of a ${objectName} complete. Thank you, come again soon!`);
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