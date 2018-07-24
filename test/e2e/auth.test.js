const request = require('./request');
const { assert } = require('chai');
const db = require('./db');

describe('Authentication API', () => {
  beforeEach(() => {
    db.drop();
  });
  let token = null;
  let char = null;
  let ship = null;

  beforeEach(() => {
    ship = {
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
      .then(({ body }) => (char = body))
      .then(() => {
        return request
          .post('/api/ships')
          .send(ship)
          .then(({ body }) => (ship = body));
      });
  });

  beforeEach(() => {
    return request
      .post('/api/auth/signup')
      .send({
        name: 'Tester',
        password: '007',
        Characters: ['59fa5438b894ff3f420b2206']
      })
      .then(({ body }) => {
        token = body.token;
      })
      .then(() => {
        return request
          .post(`/api/newChar/${char._id}`)
          .set('Authorization', token)
          .send({
            name: 'Ford Prefect',
            description: 'human/alien travel writer',
            user: '590643bc2cd3da2808b0e651',
            ship: ship._id,
            template: true
          });
      });
  });

  it('should give a token on signup', () => {
    assert.ok(token);
  });

  it('cant signup with the same name', () => {
    return request
      .post('/api/auth/signup')
      .send({ name: 'Tester', password: 'abc' })
      .then(
        () => {
          throw new Error('Unexpected success which is bad');
        },
        err => {
          assert.equal(err.status, 400);
        }
      );
  });

  it('cant sign up without password', () => {
    return request
      .post('/api/auth/signup')
      .send({ name: 'not the same' })
      .then(
        () => {
          throw new Error('Unexpected success which is bad');
        },
        err => {
          assert.equal(err.status, 400);
        }
      );
  });

  it('should sign in with the same credentials', () => {
    return request
      .post('/api/auth/signin')
      .send({ name: 'Tester', password: '007' })
      .then(({ body }) => {
        assert.ok(body.token);
        assert.ok(body.userChars);
      });
  });

  it('cant sign in with wrong credentials', () => {
    return request
      .post('/api/auth/signin')
      .send({ name: 'Tester', password: '006' })
      .then(
        () => {
          throw new Error('Unexpected success which is bad');
        },
        err => {
          assert.equal(err.status, 401);
        }
      );
  });
});
