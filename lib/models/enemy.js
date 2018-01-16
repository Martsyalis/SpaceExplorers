const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Required = require('./required-fields');

const schema = new Schema({
    name: Required.String,
    healthPoints: Required.Number,
    damage: Required.Number,
    speed: Number
});

module.exports = mongoose.model('Enemy', schema);
