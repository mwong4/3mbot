/*
Author: Iamwaxy
Date Created: July 17, 2021
Purpose: Runs on start

Follow Tutorials: CodeLyon
*/

const cron = require('cron'); //Import date/time reader package
const profileModel = require('../../models/profileSchema'); //get schema+model

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

    let dailyTimer = new cron.CronJob('00 00 20 * * 0-6', dailyReward); //set up timer
    dailyTimer.start();
}