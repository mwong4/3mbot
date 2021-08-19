/*
Author: Iamwaxy
Date Created: Aug 17, 2021
Purpose: Schema for market events
*/

const mongoose = require('mongoose');

//Template for data (schema)
const marketSchema = new mongoose.Schema({
    sellerID: {type: String},
    startingPrice: {type: Number, default: 0},
    latestBidID: {type: String, default: null},
    latestBid: {type: Number, default: 0},
    creationDate: {type: Date},
    expiryDate: {type: Date},
    items: {type: [String]},
    auction: {type: Boolean},
    completed: {type: Boolean, default: false},
})

//Actual data (model)
const model = mongoose.model('MarketModels', marketSchema);

module.exports = model;