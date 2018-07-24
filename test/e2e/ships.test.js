const { assert } = require('chai');
const db = require('./db');
const request = require('./request');

describe('ship API', () => {
  let shipData = null;
  beforeEach(() => {
    db.drop();
  });
  shipData = [
    {
      name: 'Moya',
      healthPoints: 300,
      damage: 25,
      description: 'A living sentient bio-mechanical space ship.',
      class: 'Leviathan'
    },
    {
      name: 'Raza',
      healthPoints: 200,
      damage: 50,
      description:
        'The Raza is a faster-than-light armed space transport equipped with various countermeasures such as vector thrust capable nacelles. The interiors feature a spacious bridge, a small mess hall, and private crew quarters for at least six crew members. Gravity aboard the Raza is artificially generated.',
      class: 'StarShip'
    }
  ];

  it('returns a ship with a new id', () => {
    return request
      .post('/api/ships')
      .send(shipData[0])
      .then(res => assert.ok(res.body._id));
  });

  it('returns all ships when no id is given', () => {
    const savedShips = [
      request.post('/api/ships').send(shipData[0]),
      request.post('/api/ships').send(shipData[1])
    ];
    return Promise.all(savedShips).then(resArray => {
      resArray = resArray.map(res => {
        return {
          name: res.body.name,
          _id: res.body._id
        };
      });
      return request.get('/api/ships').then(received => {
        assert.deepEqual(received.body[0].name, resArray[0].name);
        assert.deepEqual(received.body[1].name, resArray[1].name);
      });
    });
  });

  it('gets a ship by id', () => {
    let razaShip = null;
    return request
      .post('/api/ships')
      .send(shipData[1])
      .then(res => {
        razaShip = res.body;
        return request.get(`/api/ships/${razaShip._id}`);
      })
      .then(res => assert.ok(res.body));
  });

  it('updates a ship', () => {
    let savedShip = null;
    return request
      .post('/api/ships')
      .send(shipData[0])
      .then(res => {
        savedShip = res.body;
        shipData[0].name = '#######';
        return request.put(`/api/ships/${savedShip._id}`).send(shipData[0]);
      })
      .then(res => {
        assert.deepEqual(res.body.nModified === 1, true);
      });
  });

  it('deletes a ship by id', () => {
    let savedShip = null;
    return request
      .post('/api/ships')
      .send(shipData[0])
      .then(res => {
        savedShip = res.body;
        return request.delete(`/api/ships/${savedShip._id}`);
      })
      .then(res => {
        assert.deepEqual(res.body, { removed: true });
      });
  });

  it('patches a ship and returns it', () => {
    return request
      .post('/api/ships')
      .send(shipData[0])
      .then(({ body: shipRes }) => {
        assert.ok(shipRes._id);
        shipRes.name = 'Mayo';
        return request
          .patch(`/api/ships/${shipRes._id}`)
          .send({ name: 'Mayo' })
          .then(({ body: updatedShip }) => {
            assert.deepEqual(shipRes, updatedShip);
          });
      });
  });
});
