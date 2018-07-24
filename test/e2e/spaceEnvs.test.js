const { assert } = require('chai');
const db = require('./db');
const request = require('./request');

describe('spaceEnv API', () => {
  let envData = null;
  beforeEach(() => db.drop());

  envData = [
    {
      name: 'Asteroid Field',
      damage: 40,
      description:
        'The asteroid belt is the circumstellar disc in the Solar System located roughly between the orbits of the planets Mars and Jupiter. It is occupied by numerous irregularly shaped bodies called asteroids or minor planets.',
      globalDmg: 30
    },
    {
      name: 'Black Hole',
      damage: 50,
      description:
        'A black hole is a region of spacetime exhibiting such strong gravitational effects that nothing—not even particles and electromagnetic radiation such as light—can escape from inside it.',
      globalDmg: 25
    }
  ];

  it('returns environment with a new id', () => {
    return request
      .post('/api/spaceEnvs')
      .send(envData[0])
      .then(res => assert.ok(res.body._id));
  });

  it('returns all when no id is given', () => {
    const savedEnv = [
      request.post('/api/spaceEnvs').send(envData[0]),
      request.post('/api/spaceEnvs').send(envData[1])
    ];
    return Promise.all(savedEnv).then(resArray => {
      resArray = resArray.map(res => {
        return {
          name: res.body.name,
          _id: res.body._id
        };
      });
      return request.get('/api/spaceEnvs').then(received => {
        assert.deepEqual(received.body[0].name, resArray[0].name);
        assert.deepEqual(received.body[1].name, resArray[1].name);
      });
    });
  });

  it('gets an env by id', () => {
    let asteroidEnv = null;
    return request
      .post('/api/spaceEnvs')
      .send(envData[1])
      .then(res => {
        asteroidEnv = res.body;
        return request.get(`/api/spaceEnvs/${asteroidEnv._id}`);
      })
      .then(res => {
        assert.deepEqual(res.body, asteroidEnv);
      });
  });

  it('updates a spaceEnv', () => {
    let savedEnvironment = null;
    return request
      .post('/api/spaceEnvs')
      .send(envData[0])
      .then(res => {
        savedEnvironment = res.body;
        envData[0].name = '#######';
        return request
          .put(`/api/spaceEnvs/${savedEnvironment._id}`)
          .send(envData[0]);
      })
      .then(res => {
        assert.deepEqual(res.body.nModified === 1, true);
      });
  });

  it('deletes environment by id', () => {
    let savedEnv = null;
    return request
      .post('/api/spaceEnvs')
      .send(envData[0])
      .then(res => {
        savedEnv = res.body;
        return request.delete(`/api/spaceEnvs/${savedEnv._id}`);
      })
      .then(res => {
        assert.deepEqual(res.body, { removed: true });
      });
  });

  it('patches an environment', () => {
    return request
      .post('/api/spaceEnvs')
      .send(envData[0])
      .then(({ body: envRes }) => {
        assert.ok(envRes._id);
        envRes.name = 'Asteroid Belt';
        return request
          .patch(`/api/spaceEnvs/${envRes._id}`)
          .send({ name: 'Asteroid Belt' })
          .then(({ body: updatedEnv }) => {
            assert.deepEqual(envRes, updatedEnv);
          });
      });
  });
});
