const { assert } = require('chai');
const User = require('../../lib/models/user');

describe('User Model', () => {
  const user = new User({
    name: 'Admiral_Adama'
  });

  it('generates hash from password', () => {
    user.generateHash('password');
    assert.isOk(user.hash);
  });

  it('compares password', () => {
    user.generateHash('secret');
    assert.isTrue(user.comparePassword('secret'));
    assert.isFalse(user.comparePassword('bollocks'));
  });

  it('should validate a good model', () => {
    const validate = user.validateSync();
    assert.equal(validate, undefined);
  });

  it('should return error if no name is provided', () => {
    const badUser = new User({});
    const { errors } = badUser.validateSync();
    assert.equal(errors.name.kind, 'required');
  });
});
