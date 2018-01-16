const mongoose = require('mongoose');
const Required = require('./required-fields');


const schema = new mongoose.Schema({
    name: Required.String,
    damage: Required.Number,
    description: Required.String,
    globalDmg: Required.Number

});

module.exports = mongoose.model('SpaceEnv', schema);