/*
Author: Iamwaxy
Date Created: Aug 18, 2021
Purpose: To cancel a listing
*/

const marketModel = require('../models/marketSchema'); //get model
const profileModel = require('../models/profileSchema');

async function removeEvent(_message, _items, _eventID)
{
    try
    {
        const data = await marketModel.findOne({_id: _eventID});

        for(const obj of _items)
        {
            //add items back into inventory
            const responseOne = await profileModel.findOneAndUpdate(
            {
                userID: _message.author.id,
            }, 
            {
                $push: { inventory : obj},
            }
            );
        }
    
        //Give bider money back
        const responseTwo = await profileModel.findOneAndUpdate(
        {
            userID: data.latestBidID,
        }, 
        {
            $inc: { coins: data.latestBid },
        }
        );

        //remove market event
        const responseThree = await marketModel.deleteOne(
        {
            
            _id: _eventID,
        }, 
        );
    }
    catch(err)
    {
        console.log(err)
    }


    return;
}

module.exports = 
{
    name: 'cancel',
    aliases: [],
    permissions: [],
    description: "To cancel listing. Syntax: >cancel #code(Found with [>market mine] command)",
    async execute(client, message, args, Discord, profileData)
    {
        const code = Number(args[0]); //Get filter command

        if(!code) return message.channel.send("ERROR: Code not specified");

        try
        {
            const data = await marketModel.find({sellerID: message.author.id}); //get all events listed under author's id

            if(!data) return message.channel.send("ERROR: No listings belonging to you");
            if(!data[code-1]) return message.channel.send("ERROR: not a valid code");

            //Get other player's confirmation. Initiator can cancel
            let filter = m => m.author.id === message.author.id
            message.channel.send(`Deleting [${data[code-1].items}]. <@${message.author.id}>, please reply with <YES> to confirm transaction. This message will expire in 30 seconds`).then(() => {
              message.channel.awaitMessages(filter, {
                  max: 1,
                  time: 30000,
                  errors: ['time']
                })
                .then(message => {
                    message = message.first()
                    if (message.content.toUpperCase() == 'YES' || message.content.toUpperCase() == 'Y') //When confirmed, call functions to run DB update 
                    {
                        //Call function to perform process to remove market event
                        remove();
                        return;
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

            async function remove()
            {
                await removeEvent(message, data[code-1].items, data[code-1]._id);

                return message.channel.send("Event removed");  
            }
            
        }
        catch(err) //catch and output errors
        {
            console.log(err);
        }
    },
};