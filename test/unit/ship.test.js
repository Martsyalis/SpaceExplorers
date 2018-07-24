const { assert } = require('chai');
const Ship = require('../../lib/models/ship');

describe('Ship Model', () => {
  let shipData = null;

  beforeEach(() =>{
    shipData = {
      name: 'Moya',
      healthPoints: 300,
      damage: 25,
      description: 'A living sentient bio-mechanical space ship.',
      class: 'Leviathan'
    };
  });

  it('checks that ship model is valid', () => {
    const farScape = new Ship(shipData);
    assert.ok(!farScape.validateSync());
    assert.ok(farScape.name);
  });

  it('checks that required fields are included', () => {
    delete shipData.name;
    const farScape = new Ship(shipData);
    assert.equal(farScape.validateSync().errors.name.kind, 'required');
  });
});
