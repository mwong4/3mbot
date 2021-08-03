/*
Author: Iamwaxy
Date Created: Aug 2, 2021
Purpose: Schema for items
*/

const mongoose = require('mongoose');

//Template for data (schema)
const itemSchema = new mongoose.Schema({
    name: {type: String},
    description: {type: String},
    numberSold: {type: Number, default: 0},
    averageValue: {type: Number, default: 0},
    tradeable: {type: Boolean},
    tier: {type: String},
    objType: {type: String}
    //image: - coming later
})

//Actual data (model)
const model = mongoose.model('ItemModels', itemSchema);

module.exports = model;