/*
Author: Iamwaxy
Date Created: Aug 4, 2021
Purpose: To see all items owned by a user
*/

const profileModel = require('../models/profileSchema'); //get models
const itemModel = require('../models/itemSchema');

module.exports = 
{
    name: 'use',
    aliases: [],
    permissions: [],
    description: "Command to <use> an object. Syntax: >use objectName",
    async execute(client, message, args, Discord, profileData)
    {
        const objectName = args[0]; //Make sure there is a name inputed
        if(!args[0])
        {
            return message.channel.send("ERROR: Missing object name");
        }

        try
        {
            var targetData = await itemModel.findOne({name: objectName}); //find target in database
            if(!targetData) return message.channel.send(`${input} is not a valid object`);

            if(targetData.objType === "crate") //Only crates are currently supported for use
            {
                if(profileData.inventory.includes(targetData.name)) //Make sure user has this in their inventory
                {
                    //Generate random number
                    const rand = getRandomInt(100)+1;

                    //Get corresponding obj type
                    var prizeType;
                    if(0 < rand && rand <= commonRate) prizeType = "common";
                    else if(commonRate < rand && rand <= uniqueRate) prizeType = "unique";
                    else if(uniqueRate < rand && rand <= rareRate) prizeType = "rare";
                    else if(rareRate < rand && rand <= 100) prizeType = "legendary";

                    //Get random object
                    var prize;
                    const prizeData = await itemModel.find({tier: prizeType}); //Get array of prizes
                    const prizePosition = getRandomInt(prizeData.length);
                    prize = prizeData[prizePosition].name;

                    const responseOne = await itemModel.findOneAndUpdate( //Increase number sold
                    {
                        name: prizeData[prizePosition].name,
                    }, 
                    {
                        $inc: {
                            numberSold: 1,
                        },
                    }
                    );
                    
                    //Remove item from inventory and replace with new item
                    const responseTwo = await profileModel.findOneAndUpdate(
                    {
                        userID: message.author.id,
                        inventory: objectName,
                    }, 
                    {
                        $set: { "inventory.$" : prize},
                    }
                    );
                }
                else
                {
                    return message.channel.send("ERROR: You dont own this item");
                }
            }
            else
            {
                return message.channel.send("Sorry, this item's use is currently not supported");
            }
        }
        catch(err)
        {
            console.log(err);
        }
    },
};