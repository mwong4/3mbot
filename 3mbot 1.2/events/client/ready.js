/*
Author: Iamwaxy
Date Created: July 17, 2021
Purpose: Runs on start

Follow Tutorials: CodeLyon
*/

const cron = require('cron'); //Import date/time reader package
require('dotenv').config(); //Requiring .env file

const profileModel = require('../../models/profileSchema'); //get models
const marketModel = require('../../models/marketSchema');
const itemModel = require('../../models/itemSchema');

module.exports = () =>
{
    console.log('3mbot online');

    //Run daily reward checker
    async function dailyReward()
    {
        //reset all with daily still true
        await profileModel.updateMany(
        {
            daily: true,
        }, 
        {
            $set: {streak: 0},
        }
        );

        //reset all with daily as false
        await profileModel.updateMany(
        {
            daily: false,
        }, 
        {
            $set: {daily: true},
        }
        );

        dailyInterest(); //Run update on interest

        console.log("Reset all daily's");
    }

    //For giving daily interest and resetting dailyTrade figure
    async function dailyInterest()
    {
        const profileData = await profileModel.find({});

        for(const profile of profileData)
        {
            const interest = Math.round(2*Math.floor(profile.bankLevel)*0.01*profile.bank);

            await profileModel.updateOne(
            {
                _id: profile._id,
            }, 
            {
                $inc: {coins: interest},
                $set: {dailyTrade: false},
            }
            );
        }

        console.log("Updated interest");
    }

    async function processMarket()
    {
        const data = await marketModel.find({}); //get all market events
        const todayDate = new Date();

        //Sift through all market events
        for(const element of data)
        {
            //Check expiry, if yes
            if(element.expiryDate.getTime() < todayDate.getTime())
            {
                if(element.auction) //If auction
                {
                    if(element.latestBid == 0) //No one has bid
                    {
                        returnOwner(element.items, element.sellerID); //Call function to put items back into owner
                    }
                    else //Someone bid
                    {
                        updateAuction(element.items, element.latestBid, element.sellerID, element.latestBidID);
                    }
                    
                }
                else //otherwise static sell event
                {
                    returnOwner(element.items, element.sellerID); //Call function to put items back into owner
                }
                remove(element._id); //Call function to remove event
            }
        }

        console.log("Processed Market");
        return;
    }

    //To return all items to owner
    async function returnOwner(_items, _sellerID)
    {
        //Give items back
        const responseOne = await profileModel.findOneAndUpdate(
        {
            userID: _sellerID,
        }, 
        {
            $push: {
                inventory: { $each: _items },
            },
        }
        );
    }

    //To give money and items to owner and bidder
    async function updateAuction(_items, _cost, _sellerID, _bidderID)
    {
        const bidderData = await profileModel.findOne({uerID: _sellerID});
        const sellerData = await profileModel.findOne({userID: _bidderID});

        var levelReward = 0;

        //See if person elegible for xp reward
        if(!bidderData.dailyTrade)
        {
            levelReward = 0.04;  //<------ benefit per day
        }

        //Give items to bidder, update if traded
        const responseOne = await profileModel.findOneAndUpdate(
        {
            userID: _bidderID,
        }, 
        {
            $push: {
                inventory: { $each: _items },
            },
            $inc: { bankLevel: levelReward },
            $set: { dailyTrade: true },
        }
        );

        levelReward = 0;

        //See if person elegible for xp reward
        if(!bidderData.dailyTrade)
        {
            levelReward = 0.04;  //<------ benefit per day
        }

        //Give money to owner, update if traded
        const responseTwo = await profileModel.findOneAndUpdate(
        {
            userID: _sellerID,
        }, 
        {
            $inc: {
                coins: _cost,
                bankLevel: levelReward,
            },
            $set: { dailyTrade: true },
        }
        );

        //Update item data
        for(const item of _items)
        {
            const data = await itemModel.findOne({name: item});
            const newAvg = Math.round(((_cost / _items.length) + (data.averageValue*data.numberSold)) / (data.numberSold + 1))

            const responseThree = await itemModel.findOneAndUpdate(
            {
                name: item,
            }, 
            {
                $inc: {
                    numberSold : 1,
                },
                $set: {
                    averageValue: newAvg,
                },
            }
            );

        }
    }

    //remove market event by id
    async function remove(_objId) 
    {
        const responseTwo = await marketModel.deleteOne({ _id: _objId });
        return;
    }

    let dailyTimer = new cron.CronJob('00 15 17 * * 0-6', dailyReward); //set up timer ('00 00 20 * * 0-6')
    let marketTimer = new cron.CronJob('0 */5 * * * *', processMarket);
    dailyTimer.start();
    marketTimer.start();
}

function includesNum(_array, _filter)
{
    var counter = 0;
    for(const element of _array)
    {
        if(element == _filter) counter ++;
    }
    return counter;
}