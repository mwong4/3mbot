/*
Author: Iamwaxy
Date Created: July 17, 2021
Purpose: Runs on start

Follow Tutorials: CodeLyon
*/

const cron = require('cron'); //Import date/time reader package
const profileModel = require('../../models/profileSchema'); //get schema+model
const marketModel = require('../../models/marketSchema'); //get model

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

        console.log("Reset all daily's");
    }

    async function processMarket()
    {
        const data = await marketModel.findOne({}); //get all market events
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
        //Give items to bidder
        const responseOne = await profileModel.findOneAndUpdate(
        {
            userID: _bidderID,
        }, 
        {
            $push: {
                inventory: { $each: _items },
            },
        }
        );

        //Give money to owner
        const responseTwo = await profileModel.findOneAndUpdate(
        {
            userID: _sellerID,
        }, 
        {
            $inc: {
                coins: _cost,
            },
        }
        );
    }

    //remove market event by id
    async function remove(_objId) 
    {
        const responseTwo = await marketModel.deleteOne({ _id: _objId });
        return;
    }

    let dailyTimer = new cron.CronJob('00 00 20 * * 0-6', dailyReward); //set up timer
    let marketTimer = new cron.CronJob('0 */5 * * * *', processMarket);
    dailyTimer.start();
    marketTimer.start();
}