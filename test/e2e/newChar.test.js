const request = require('./request');
const assert = require('chai').assert;
const db = require('./db');
const Ship = require('../../lib/models/ship');

describe('newChar API', () => {
  beforeEach(() => {
    db.drop();
  });

  let token = null;
  let char = null;
  let savedShip = null;

  beforeEach(() => {
    const ship = {
      name: 'Moya',
      healthPoints: 300,
      damage: 25,
      description: 'A living sentient bio-mechanical space ship.',
      class: 'Leviathan'
    };
    return request
      .post('/api/characters')
      .send({
        name: 'Ford Prefect',
        description: 'human/alien travel writer',
        user: '590643bc2cd3da2808b0e651',
        ship: ship,
        template: true
      })
      .then(({ body }) => (char = body));
  });

  beforeEach(() => {
    new Ship({
      name: 'Moya',
      healthPoints: 1000,
      damage: 100,
      description: 'A living sentient bio-mechanical space ship.',
      class: 'Leviathan'
    })
      .save()
      .then(saved => {
        savedShip = saved;
      });
  });

  beforeEach(() => {
    return request
      .post('/api/auth/signup')
      .send({ name: 'Tester', password: '007' })
      .then(({ body }) => {
        token = body.token;
      });
  });

  it('saves a character to the database', () => {
    return request
      .post(`/api/newChar/${char._id}`)
      .set('Authorization', token)
      .send({ ship: savedShip._id })
      .then(got => {
        assert.ok(got.body);
      });
  });
});
