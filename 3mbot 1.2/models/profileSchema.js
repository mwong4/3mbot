/*
Author: Iamwaxy
Date Created: July 19, 2021
Purpose: Has profile schema and model

Follow Tutorials: CodeLyon
*/

const mongoose = require('mongoose');

//Template for data (schema)
const profileSchema = new mongoose.Schema({
    userID: {type: String, require: true, unique: true},
    serverID: {type: String, require: true},
    streak: {type: Number, default: 0},
    daily: {type: Boolean}, //true when available
    coins: {type: Number, default: 1000},
    bank: {type: Number},
    boosterTime: {type: Date, default: 0}, //time before next boost reward
    inventory: {type: [String]}
})

//Actual data (model)
const model = mongoose.model('ProfileModels', profileSchema);

module.exports = model;