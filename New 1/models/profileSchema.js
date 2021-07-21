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
    coins: {type: Number, default: 1000},
    bank: {type: Number}
})

//Actual data (model)
const model = mongoose.model('ProfileModels', profileSchema);

module.exports = module;