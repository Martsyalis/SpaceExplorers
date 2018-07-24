const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
const Required = require('./required-fields');

const Character = {
  type: Schema.Types.ObjectId,
  ref: 'Character'
};

const schema = new Schema({
  name: Required.String,
  hash: Required.String,
  Characters: [Character]
});

schema.methods.generateHash = function(password) {
  this.hash = bcrypt.hashSync(password, 8);
};

schema.methods.comparePassword = function(password) {
  return bcrypt.compareSync(password, this.hash);
};

schema.statics.nameExists = function(name) {
  return this.find({ name })
    .count()
    .then(count => count > 0);
};

module.exports = mongoose.model('User', schema);
