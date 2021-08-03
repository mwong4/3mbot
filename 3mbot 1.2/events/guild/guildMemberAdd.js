/*
Author: Iamwaxy
Date Created: July 19, 2021
Purpose: Used to add users

Follow Tutorials: CodeLyon
*/


const profileModel = require('../../models/profileSchema'); //get model

module.exports = async(client, discord, member) =>{
    console.log("User Joined");
    let profile = await profileModel.create({ //make profile
        userID: member.id,
        serverID: member.guild.id,
        streak: 0,
        daily: true,
        coins: 1000,
        bank: 0,
        boostReward: false,
        inventory: []
    });
    profile.save(); //Save profile to database  

    /*
    let item = await itemModel.create({ //make profile
        name: "test",
        description: "just a test",
        numberSold: 0,
        averageValue: 0,
        tradeable: true,
        tier: "common"
    });
    item.save(); //Save profile to database 
    */ 
};
