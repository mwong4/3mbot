/*
Author: Iamwaxy
Date Created: Aug 14, 2021
Purpose: To trade items with another user
*/

const profileModel = require('../models/profileSchema'); //get models
const itemModel = require('../models/itemSchema');

//Function for updating coins in DB
async function updateCoins(_myAmount, _partnerAmount, _me, _partner)
{
    console.log("update");
    const responseOne = await profileModel.findOneAndUpdate(
    {
        userID: _me,
    }, 
    {
        $inc: {
            coins: _partnerAmount-_myAmount,
        },
    }
    );
    const responseTwo = await profileModel.findOneAndUpdate(
    {
        userID: _partner,
    }, 
    {
        $inc: {
            coins: _myAmount-_partnerAmount,
        },
    }
    );
}

//Function for updating objects in DB
async function updateObjs(_myList, _partnerList, _me, _partner, _callback)
{
    console.log("update 2");
    for(const obj of _myList) //update me
    {
        const responseOne = await profileModel.findOneAndUpdate(
        {
            userID: _me,
            inventory: obj,
        }, 
        {
            $set: { "inventory.$" : null},
        }
        );
        const responseTwo = await profileModel.findOneAndUpdate( //Remove any null figures in inventory
        {
            userID: _me,
        }, 
        {
            $pull: {
                inventory: null,
            },
        }
        );
        const responseThree = await profileModel.findOneAndUpdate( //Add to partner
        {
            userID: _partner,
        }, 
        {
            $push: {
                inventory: obj,
            },
        }
        );
    }

    for(const obj of _partnerList) //Update partner
    {
        const responseOne = await profileModel.findOneAndUpdate(
        {
            userID: _partner,
            inventory: obj,
        }, 
        {
            $set: { "inventory.$" : null},
        }
        );
        const responseTwo = await profileModel.findOneAndUpdate( //Remove any null figures in inventory
        {
            userID: _partner,
        }, 
        {
            $pull: {
                inventory: null,
            },
        }
        );
        const responseThree = await profileModel.findOneAndUpdate( //Add to me
        {
            userID: _me,
        }, 
        {
            $push: {
                inventory: obj,
            },
        }
        );
    }
    _callback();
}

//To sort through argument list
async function sortList(_message, _obj, _data, _array, _person)
{
    if(!isNaN(_obj)) //Check if number
    {
        const num = Number(_obj);

        if(num % 1 != 0 || num <= 0)
        {
            _message.channel.send('ERROR: Coin amount must be a positive whole number'); //make sure input is not negative and is whole first
            return _array;
        }

        if(_data.coins < num)
        {
            _message.channel.send(`ERROR: ${_person} have ${num} coins in wallet`);
            return _array;
        }

        _array[0] = (Number(_array[0]) + Number(num)).toString(10); //Add to array
        return _array;
    }
    else
    {
        const itemData = await itemModel.findOne({name: _obj}); //get item data
        if(!itemData)
        {
            _message.channel.send(`ERROR: ${_obj} is not a valid item`);
            return  _array;
        }

        if(_data.inventory.includes(_obj))
        {
            _array.push(_obj.toString()); //Push to list
            return _array;
        }
        else
        {
            _message.channel.send(`ERROR: ${_person} not have the item: ${_obj}`);
            return _array;
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

            //Go through my stuff and partner stuff, see if player has these items. If yes, add to arrays (use sorting functions)
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
                    myStuff = await sortList(message, obj, profileData, myStuff, "You do");
                }
                else //Running through PARTNER list
                {
                    partnerStuff = await sortList(message, obj, partnerData, partnerStuff, "Partner does");
                }
            }

            //Get other player's confirmation. Initiator can cancel
            let filter = m => m.author.id === partner.id
            message.channel.send(`Tradeing [${myStuff.join(", ")}] for [${partnerStuff.join(", ")}]. <@${partner.id}>, please reply with <YES> to confirm transaction. This message will expire in 30 seconds`).then(() => {
              message.channel.awaitMessages(filter, {
                  max: 1,
                  time: 30000,
                  errors: ['time']
                })
                .then(message => {
                    message = message.first()
                    if (message.content.toUpperCase() == 'YES' || message.content.toUpperCase() == 'Y') //When confirmed, call functions to run DB update 
                    {
                        //See if coins are exchanged. If yes, exchange
                        if(myStuff[0] != "0" || partnerStuff[0] != "0")
                        {
                            updateCoins(Number(myStuff[0]), Number(partnerStuff[0]), message.author.id, partner.id); //Update coins
                        }

                        updateObjs(myStuff.slice(1), partnerStuff.slice(1), message.author.id, partner.id, function() { //Update everything else
                            return message.channel.send(`Trade: ${myStuff.join(", ")} for ${partnerStuff.join(", ")} complete`);
                        }); 
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
        catch(err)
        {
            console.log(err);
        }
    },
};