/*
Author: Iamwaxy
Date Created: Aug 3, 2021
Purpose: To be able to edit the details of an item
*/

const itemModel = require('../models/itemSchema'); //get models
const profileModel = require('../models/profileSchema');

module.exports = 
{
    name: 'edit',
    aliases: ["edititem"],
    permissions: ["ADMINISTRATOR"],
    description: "To edit an item. Syntax: >edit itemName  operation (name, description, numbersold, averagevalue, tradeable, tier, objtype, photoid, purchasable, rates)  value (value for selected operation)",
    async execute(client, message, args, Discord, profileData)
    {
        if(args.length < 3) return message.channel.send("ERROR: Missing arguments"); //Make sure enough arguments provided

        const objName = args[0];
        const operation = args[1];
        const input  = args.splice(2, args.length).join(" ");

        try
        {
            const targetData = await itemModel.findOne({name: args[0]}); //find target in database

            if(targetData) //check if object exists
            {
                if(operation === "name")
                {
                    
                    await profileModel.updateMany(
                    {
                        
                    }, 
                    {
                        $set: { "inventory.$[element]" : input},
                    },
                    {
                        arrayFilters: [ { element: objName}]
                    }
                    );
                    

                    const response = await itemModel.findOneAndUpdate( //Set name
                    {
                        name: objName,
                    }, 
                    {
                        $set: {
                            name: input,
                        },
                    }
                    );
                }
                else if(operation === "description")
                {
                    const response = await itemModel.findOneAndUpdate( //Set name
                    {
                        name: objName,
                    }, 
                    {
                        $set: {
                            description: input,
                        },
                    }
                    );
                }
                else if(operation === "numbersold")
                {
                    //check positive whole number
                    if(input % 1 != 0 || input < 0) return message.channel.send('ERROR: Amount must be a positive whole number');

                    const response = await itemModel.findOneAndUpdate( //Set name
                    {
                        name: objName,
                    }, 
                    {
                        $set: {
                            numberSold: input,
                        },
                    }
                    );
                    
                }
                else if(operation === "averagevalue")
                {
                    //check positive whole number
                    if(input % 1 != 0 || input < 0) return message.channel.send('ERROR: Amount must be a positive whole number');

                    const response = await itemModel.findOneAndUpdate( //Set name
                    {
                        name: objName,
                    }, 
                    {
                        $set: {
                            averageValue: input,
                        },
                    }
                    );
                }
                else if(operation === "tradeable")
                {
                    //check bool
                    var convertedInput = false;

                    if(input === "true") convertedInput = true;
                    else if(input === "false") convertedInput = false;
                    else return message.channel.send("ERROR: [tradeable] is not a boolean (ie, true, false)");

                    const response = await itemModel.findOneAndUpdate( //Set name
                    {
                        name: objName,
                    }, 
                    {
                        $set: {
                            tradeable: convertedInput,
                        },
                    }
                    );
                }
                else if(operation === "tier")
                {
                    const response = await itemModel.findOneAndUpdate( //Set name
                    {
                        name: objName,
                    }, 
                    {
                        $set: {
                            tier: input,
                        },
                    }
                    );
                }
                else if(operation === "objtype")
                {
                    const response = await itemModel.findOneAndUpdate( //Set name
                    {
                        name: objName,
                    }, 
                    {
                        $set: {
                            objType: input,
                        },
                    }
                    );
                }
                else if(operation === "photoid")
                {
                    const response = await itemModel.findOneAndUpdate( //Set name
                    {
                        name: objName,
                    }, 
                    {
                        $set: {
                            photoID: input,
                        },
                    }
                    );
                }
                else if(operation === "purchasable")
                {
                    //check bool
                    var convertedInput = false;

                    if(input === "true") convertedInput = true;
                    else if(input === "false") convertedInput = false;
                    else return message.channel.send("ERROR: [tradeable] is not a boolean (ie, true, false)");

                    const response = await itemModel.findOneAndUpdate( //Set name
                    {
                        name: objName,
                    }, 
                    {
                        $set: {
                            purchasable: convertedInput,
                        },
                    }
                    );
                }
                else if(operation === "rates")
                {
                    //check positive whole number
                    if(input % 1 != 0 || input < 0) return message.channel.send('ERROR: Amount must be a positive whole number');

                    const response = await itemModel.findOneAndUpdate( //Set name
                    {
                        name: objName,
                    }, 
                    {
                        $set: {
                            rates: input,
                        },
                    }
                    );
                }
                else
                {
                    return message.channel.send(`${operation} is not a valid operator. (ie. name, description, numbersold, averagevalue, tradeable, tier, objtype, photoid, purchasable, rates)`)
                }
                return message.channel.send(`${operation} on ${objName} has been updated`); //Send success message
            }
            else
            {
                return message.channel.send("ERROR: Object does not exist")
            }
        }
        catch(err) //catch and output errors
        {
            console.log(err);
        }
    },
};