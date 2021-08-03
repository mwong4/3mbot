/*
Author: Iamwaxy
Date Created: Aug 3, 2021
Purpose: To see all items in the database
*/

const itemModel = require('../models/itemSchema'); //get model

module.exports = 
{
    name: 'inspectAll',
    aliases: ["inspectall", "seeall"],
    permissions: ["ADMINISTRATOR"],
    description: "To see all valid items. Syntax: >inspectAll",
    async execute(client, message, args, Discord, profileData)
    {

    },
};