/*
Author: Iamwaxy
Date Created: Aug 14, 2021
Purpose: To trade items with another user
*/

const profileModel = require('../models/profileSchema'); //get models
const itemModel = require('../models/itemSchema');

//Function for updating coins in DB
async function updateCoins()
{

}

//Function for updating objects in DB
async function updateObjs()
{
    
}

//To sort through argument list
async function sortList(_message, _obj, _data, _array, _person)
{
    if(!isNaN(_obj)) //Check if number
    {
        const num = Number(_obj);

        if(num % 1 != 0 || num <= 0) return _message.channel.send('ERROR: Coin amount must be a positive whole number'); //make sure input is not negative and is whole first

        if(_data.coins < num) return _message.channel.send(`ERROR: ${_person} have ${num} coins in wallet`);

        _array[0] = (Number(_array[0]) + Number(num)).toString(10); //Add to array
    }
    else
    {
        const itemData = await itemModel.findOne({name: _obj}); //get item data
        if(!itemData) return _message.channel.send(`ERROR: ${_obj} is not a valid item`);

        if(_data.inventory.includes(_obj))
        {
            console.log(_obj);
            _array.push(_obj); //Push to list
            console.log(_array);
        }
        else
        {
            return _message.channel.send(`ERROR: ${_person} not have the item: ${_obj}`);
        }
    }
    return;
}

module.exports = 
{
    name: 'trade',
    aliases: ["exchange"],
    permissions: [],
    description: "To trade with someone. Syntax: >trade  @otherUserName  yourStuff(ie: sword axe 1000)  for(<-- keyWord) otherUserStuff(ie: 4000 common_crate)",
    async execute(client, message, args, Discord, profileData)
    {
        if(!args.length) return message.channel.send('ERROR: Missing arguments. Did you mention a player?'); //Make sure person is mentioned
        if(!args.includes("for")) return message.channel.send('ERROR: Missing key word <for>'); //Make sure key word: for is present

        const partner = message.mentions.users.first();
        if(!partner) return message.channel.send("ERROR: User mentioned does not exist");

        var myStuff = ["0"]; //Declaring variabels to store stuff
        var partnerStuff = ["0"];

        try
        {
            //check if both people are in the database
            const myData = await profileModel.findOne({userID: message.author.id});
            const partnerData = await profileModel.findOne({userID: partner.id});

            //Go through my stuff, see if player has these items. If yes, add to myStuff
            var onSecond = false;
            args = args.slice(1);
            for(const obj of args)
            {
                if(obj === "for") //If key word detected
                {
                    onSecond = true;
                }
                else if(!onSecond) //Running through MY list                              (TODO: Put in function)
                {
                    sortList(message, obj, profileData, myStuff, "You do");
                }
                else //Running through PARTNER list
                {
                    sortList(message, obj, partnerData, partnerStuff, "Partner does");
                }
            }

            console.log(myStuff);
            console.log(partnerStuff);
            return console.log("no problems");

            //Go through partner stuff, see if player has these items. If yes, add to partnerStuff

            //Get other player's confirmation. Initiator can cancel

            //When confirmed, call functions to run DB update 

        }
        catch(err)
        {
            console.log(err);
        }
    },
};