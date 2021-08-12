/*
Author: Iamwaxy
Date Created: Aug 4, 2021
Purpose: To see all items owned by a user
*/

const profileModel = require('../models/profileSchema'); //get models
const itemModel = require('../models/itemSchema');

module.exports = 
{
    name: 'use',
    aliases: [],
    permissions: [],
    description: "Command to <use> an object. Syntax: >use objectName",
    async execute(client, message, args, Discord, profileData)
    {
        try
        {

        }
        catch(err)
        {
            console.log(err);
        }
    },
};