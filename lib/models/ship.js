const mongoose = require('mongoose');
const Required = require('./required-fields');

const schema = new mongoose.Schema({
  name: Required.String,
  healthPoints: Required.Number,
  damage: Required.Number,
  speed: Number,
  description: String,
  class: String
});

module.exports = mongoose.model('Ship', schema);
