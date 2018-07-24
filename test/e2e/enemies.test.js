const assert = require('chai').assert;
const db = require('./db');
const request = require('./request');

describe('enemy API', () => {
  beforeEach(() => {
    db.drop();
  });

  const cylonWarRaider = {
    name: 'Advanced Cylon War Raider Battalion',
    damage: 25,
    healthPoints: 55
  };

  const klingonWarbird = {
    name: 'Klingon Warbird',
    damage: 35,
    healthPoints: 50
  };

  it('saves an enemy with an id', () => {
    return request
      .post('/api/enemies')
      .send(cylonWarRaider)
      .then(res => {
        const enemy = res.body;
        assert.ok(enemy._id);
        assert.equal(enemy.name, cylonWarRaider.name);
      });
  });

  it('gets all enemies', () => {
    let allEnemies = [];
    return Promise.all([
      request
        .post('/api/enemies')
        .send(cylonWarRaider)
        .then(res => allEnemies.push(res.body)),
      request
        .post('/api/enemies')
        .send(klingonWarbird)
        .then(res => allEnemies.push(res.body))
    ]).then(() => {
      return request.get('/api/enemies').then(gotEnemies => {
        gotEnemies = gotEnemies.body.sort((a, b) => a._id < b._id);
        allEnemies = allEnemies.sort((a, b) => a._id < b._id);
        assert.deepEqual(allEnemies, gotEnemies);
      });
    });
  });

  it('gets an enemy by id', () => {
    return request
      .post('/api/enemies')
      .send(klingonWarbird)
      .then(res => {
        const savedEnemy = res.body;
        return request.get(`/api/enemies/${savedEnemy._id}`).then(gotEnemy => {
          gotEnemy = gotEnemy.body;
          assert.deepEqual(savedEnemy, gotEnemy);
        });
      });
  });

  it('updates an enemy', () => {
    let savedEnemy = null;
    return request
      .post('/api/enemies')
      .send(cylonWarRaider)
      .then(res => {
        savedEnemy = res.body;
        cylonWarRaider.name = '#######';
        return request
          .put(`/api/enemies/${savedEnemy._id}`)
          .send(cylonWarRaider);
      })
      .then(res => assert.deepEqual(res.body.nModified === 1, true));
  });

  it('deletes enemy by id', () => {
    let savedEnemy = null;
    return request
      .post('/api/enemies')
      .send(klingonWarbird)
      .then(res => {
        savedEnemy = res.body;
        return request.delete(`/api/enemies/${savedEnemy._id}`);
      })
      .then(res => assert.deepEqual(res.body, { removed: true }));
  });

  it('patches enemy', () => {
    return request
      .post('/api/enemies')
      .send(klingonWarbird)
      .then(({ body: enemyRes }) => {
        assert.ok(enemyRes._id);
        enemyRes.name = 'Klingon War hawk';
        return request
          .patch(`/api/enemies/${enemyRes._id}`)
          .send({ name: 'Klingon War hawk' })
          .then(({ body: updatedEnemy }) => {
            assert.deepEqual(enemyRes, updatedEnemy);
          });
      });
  });
});
