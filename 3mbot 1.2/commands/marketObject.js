/*
Author: Iamwaxy
Date Created: Aug 18, 2021
Purpose: To sell/auction an item
*/

const marketModel = require('../models/marketSchema'); //get model
const profileModel = require('../models/profileSchema');
const itemModel = require('../models/itemSchema');

module.exports = 
{
    name: 'marketObject',
    aliases: ["marketobject", "marketobj", "mobj"],
    permissions: [],
    description: "To sell/auction an item. Syntax: >addObject startingPrice  timeSelling(Max 14 days, in **hours**)  auction?(true, false)  items(in a list, seprated by 1 space)",
    async execute(client, message, args, Discord, profileData)
    {
        if(args.length < 4) return message.channel.send("ERROR: Missing arguments"); //Make sure enough arguments provided

        const startingPrice = args[0];
        const timeToSell = args[1];
        const myID = message.author.id;

        var auction = false;

        //Convert string to bool
        if(args[2] === "true") auction = true;
        else if(args[2] === "false") auction = false;
        else return message.channel.send("ERROR: [auction] is not a boolean (ie, true, false)");

        if(startingPrice % 1 != 0 || startingPrice < 0) return message.channel.send('ERROR: Price/Starting Price must be a positive whole number'); //make sure input is not negative and is whole first
        if(timeToSell % 1 != 0 || timeToSell < 0) return message.channel.send('ERROR: Selling time must be a positive whole number'); //make sure input is not negative and is whole first

        var todayDate = new Date(); //Set dates
        var futureDate = new Date();
        futureDate.setHours(todayDate.getHours() + timeToSell);

        var items = args.splice(3);

        try
        {
            const userData = await profileModel.findOne({userID: message.author.id}); //get user data from db

            for(const obj of items) //Check to see if person has item and if item exists
            {
                if(!userData.inventory.includes(obj)) return message.channel.send(`ERROR: You do not own the item: ${obj}`); //Check inv

                const itemData = await itemModel.findOne({name: obj});
                if(!itemData) return message.channel.send(`ERROR: ${obj} is not a valid item`); //Check db
            }

            let event = await marketModel.create({ //make profile
                sellerID: myID,
                startingPrice: startingPrice,
                latestBidID: null,
                latestBid: 0,
                creationDate: todayDate,
                expiryDate: futureDate,
                items: items,
                auction: auction,
                completed: false,
            });
            event.save(); //Save profile to database 

            for(const obj of items) //Check to see if person has item and if item exists
            {
                //Remove item from inv
                const responseOne = await profileModel.findOneAndUpdate(
                {
                    userID: message.author.id,
                    inventory: obj,
                }, 
                {
                    $set: { "inventory.$" : null},
                }
                );
            }

            const responseTwo = await profileModel.findOneAndUpdate( //Remove any null figures in inventory
            {
                userID: message.author.id,
            }, 
            {
                $pull: {
                    inventory: null,
                },
            }
            );

            return message.channel.send("Market event created");
        }
        catch(err) //catch and output errors
        {
            console.log(err);
        }
    },
};