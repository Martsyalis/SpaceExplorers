const connect = require('../../lib/connect');
const mongoose = require('mongoose');

before(() => {
  connect();
});
after(() => mongoose.connection.close());

module.exports = {
  drop() {
    return mongoose.connection.dropDatabase();
  }
};
