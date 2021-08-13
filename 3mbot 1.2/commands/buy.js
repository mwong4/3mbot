/*
Author: Iamwaxy
Date Created: Aug 13, 2021
Purpose: To purchase items
*/

const profileModel = require('../models/profileSchema'); //get models
const itemModel = require('../models/itemSchema');

module.exports = 
{
    name: 'buy',
    aliases: ["purchase"],
    permissions: [],
    description: "See the catalogue and buy objects with this command. Syntax (see catalogue): >buy. Syntax (purchase object): >buy objectName",
    async execute(client, message, args, Discord, profileData)
    {
        const objectName = args[0]; //Make sure there is a name inputed

        try
        {
            if(!objectName) //This is for showing catalogue
            {
                const newEmbed = new Discord.MessageEmbed() //make embed
                .setTitle("Chrys's Corner Shop")
                .setDescription("Best prices in town. Use **>buy objectName** to purchase")
                .setColor("#FBE8A3") //Set to purple
    
                //Get price on every single purchasable item
                data = await itemModel.find({purchasable: true});
                for(const obj of data)
                {
                    const splitData = obj.rates.split(" ");
                    newEmbed.addField(obj.name, `${splitData[0]} coins`, true);
                }

                return message.channel.send(newEmbed); //Send embed
            }
            else //To purchase item
            {
                if(!profileData) return message.channel.send("ERROR: No account found in database");
    
                var targetData = await itemModel.findOne({name: objectName}); //find target in database
                if(!targetData) return message.channel.send(`${objectName} is not a valid object`);
    
                const splitRates = targetData.rates.split(" "); //Split barcode into components
    
                if(profileData.coins >= Number(splitRates[0]))//Check if they have enough money
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
                    return message.channel.send(`ERROR: Not enough coins in wallet. You need ${splitRates[0]} coins`);
                }
            }
        }
        catch(err)
        {
            console.log(err);
        }
    },
};