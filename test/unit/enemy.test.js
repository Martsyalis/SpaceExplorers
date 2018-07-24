const assert = require('chai').assert;
const Enemy = require('../../lib/models/enemy');

describe('Enemy model', () => {
  it('validates a good enemy model', () => {
    const enemy = new Enemy({
      name: 'Advanced Cylon War Raider Battalion',
      damage: 15,
      healthPoints: 50
    });
    assert.equal(enemy.validateSync(), undefined);
  });

  it('checks for required fields', () => {
    const enemy = new Enemy({});
    const { errors } = enemy.validateSync();
    assert.equal(errors.name.kind, 'required');
    assert.equal(errors.damage.kind, 'required');
    assert.equal(errors.healthPoints.kind, 'required');
  });
});
