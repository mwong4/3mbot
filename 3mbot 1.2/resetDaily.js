/*
Author: Iamwaxy
Date Created: July 25, 2021
Purpose: For resetting daily rewards
*/

const profileModel = require('../../models/profileSchema'); //get schema+model

module.exports =
{
    execute(client, Discord)
    {
        console.log("hi");
        //Setting up daity reward timer
        function dailyReward()
        {
            console.log("Hello World");
        }

        let dailyTimer = new cron.CronJob('00 7 21 * * 0-6', dailyReward); //set up timer
        dailyTimer.start();
    }
};

