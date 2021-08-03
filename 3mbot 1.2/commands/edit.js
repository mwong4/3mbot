/*
Author: Iamwaxy
Date Created: Aug 3, 2021
Purpose: To be able to edit the details of an item
*/

const itemModel = require('../models/itemSchema'); //get model

module.exports = 
{
    name: 'edit',
    aliases: ["edititem"],
    permissions: ["ADMINISTRATOR"],
    description: "To edit an item. Syntax: >edit itemName",
    async execute(client, message, args, Discord, profileData)
    {
        
    },
};