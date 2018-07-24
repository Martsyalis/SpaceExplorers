const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Required = require('./required-fields');

const characterSchema = new Schema({
  name: Required.String,
  description: String,
  template: Boolean,
  ship: {
    name: Required.String,
    healthPoints: Required.Number,
    damage: Required.Number,
    description: String,
    class: String,
    speed: Number
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  currentEvent: {
    event: {},
    enemy: {}
  },
  log: [
    {
      event: {
        type: Schema.Types.ObjectId,
        ref: 'Event'
      }
    }
  ]
});

module.exports = mongoose.model('Character', characterSchema);
