const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Required = require('./required-fields');

const schema = new Schema({
  scenario: Required.String,
  spaceEnv: {
    type: Schema.Types.ObjectId,
    ref: 'SpaceEnv',
    required: true
  },
  enemy: {
    type: Schema.Types.ObjectId,
    ref: 'Enemy',
    required: true
  },
  actions: [
    {
      option: {
        type: String,
        enum: ['Attack', 'Run', 'Diplomacy'],
        required: true
      },

      difficulty: Required.Number,

      success: {
        description: Required.String,
        outcome: Required.Number
      },
      failure: {
        description: Required.String,
        outcome: Required.Number
      }
    }
  ]
});

module.exports = mongoose.model('Event', schema);
