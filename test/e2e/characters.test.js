const request = require('./request');
const assert = require('chai').assert;
const db = require('./db');

describe('characters API', () => {
  let savedEnvironment = null;
  let savedEnemy = null;
  let savedEvent = null;
  let testEvent = null;
  let characterData = null;

  beforeEach(() => {
    db.drop();
  });

  const ship = {
    name: 'Moya',
    healthPoints: 300,
    damage: 25,
    description: 'A living sentient bio-mechanical space ship.',
    class: 'Leviathan'
  };

  const enemy = {
    name: 'Advanced Cylon War Raider Battalion',
    damage: 15,
    healthPoints: 50
  };

  const environment = {
    name: 'Asteroid Field',
    damage: 40,
    description:
      'The asteroid belt is the circumstellar disc in the Solar System located roughly between the orbits of the planets Mars and Jupiter. It is occupied by numerous irregularly shaped bodies called asteroids or minor planets.',
    globalDmg: 30
  };

  beforeEach(() => {
    return Promise.all([
      request
        .post('/api/enemies')
        .send(enemy)
        .then(res => (savedEnemy = res.body)),
      request
        .post('/api/spaceEnvs')
        .send(environment)
        .then(res => (savedEnvironment = res.body))
    ]).then(() => {
      testEvent = {
        scenario:
          'You have encountered an Advanced Cylon War Raider Battalion inside of an astroid field!',
        spaceEnv: savedEnvironment._id,
        enemy: savedEnemy._id,
        actions: [
          {
            option: 'Attack',
            difficulty: 3,
            success: {
              description:
                'You have decided to engage the Advanced Cylon War Raider squad, Your point defences cut each squadron in turn, sustaining minimal damage',
              outcome: 0
            },
            failure: {
              description:
                'You have decided to engage the Advanced Cylon War Raider squad. Your point defense system was overwhelmed by the swarming raiders and your ship sustained heavy damage',
              outcome: -40
            }
          },
          {
            option: 'Diplomacy',
            difficulty: 0,
            success: {
              description:
                'You have decided to negotiate with the Advanced Cylon War Raider squad. Surprisingly they decided to bury the hatchet of war and become friends. Apparently all that was needed was a little human/robot kindness.',
              outcome: 0
            },

            failure: {
              description: 'not gonna happen',
              outcome: 1
            }
          },
          {
            option: 'Run',
            difficulty: 6,
            success: {
              description:
                'You have decided to try and outrun the Advanced Cylon War Raider squad. Your swift ship leaves the squad in the dust',
              outcome: 0
            },
            failure: {
              description:
                'You have decided to outrun the Advanced Cylon War Raider squad. Unfortunately fast and nimble raiders manage to inflict significant damage before your ship manages to jump away',
              outcome: -40
            }
          }
        ]
      };
      return request
        .post('/api/events')
        .send(testEvent)
        .then(got => {
          savedEvent = got.body;
        })
        .then(() => {
          characterData = [
            {
              name: 'Ford Prefect',
              description: 'human/alien travel writer',
              user: '590643bc2cd3da2808b0e651',
              ship: ship,
              currentEvent: { event: savedEvent._id }
            },
            {
              name: 'Mark Watney',
              description: 'Martian - colonized a planet on his own',
              user: '590643bc2cd3da2808b0e651',
              ship: ship,
              currentEvent: { event: savedEvent._id }
            }
          ];
        });
    });
  });

  it('saves a character', () => {
    return request
      .post('/api/characters')
      .send(characterData[0])
      .then(({ body }) => assert.equal(body.name, characterData[0].name));
  }),
  it('gets all characters', () => {
    let characterCollection = characterData.map(item => {
      return request
        .post('/api/characters')
        .send(item)
        .then(res => res.body);
    });

    let saved = null;
    return Promise.all(characterCollection)
      .then(_saved => {
        saved = _saved;
        return request.get('/api/characters');
      })
      .then(res => {
        assert.deepEqual(res.body, saved);
        assert.equal(res.body[1].name, 'Mark Watney');
      });
  }),
  it('gets a character by id', () => {
    let savedCharacter = null;
    return request
      .post('/api/characters')
      .send(characterData[0])
      .then(res => {
        savedCharacter = res.body;
      })
      .then(() => {
        return request.get(`/api/characters/${savedCharacter._id}`);
      })
      .then(res => assert.equal(res.body.name, 'Ford Prefect'));
  });

  it('updates a character', () => {
    let savedCharacter = null;
    return request
      .post('/api/characters')
      .send(characterData[0])
      .then(res => {
        savedCharacter = res.body;
        characterData[0].name = 'Helena Cain';
        return request
          .put(`/api/characters/${savedCharacter._id}`)
          .send(characterData[0]);
      })
      .then(res => assert.deepEqual(res.body.nModified === 1, true));
  });

  it('deletes character by id', () => {
    let savedCharacter = null;
    return request
      .post('/api/characters')
      .send(characterData[0])
      .then(res => {
        savedCharacter = res.body;
        return request.delete(`/api/characters/${savedCharacter._id}`);
      })
      .then(res => assert.deepEqual(res.body, { removed: true }));
  });

  it('patches a character by id', () => {
    return request
      .post('/api/characters')
      .send(characterData[0])
      .then(({ body: charRes }) => {
        assert.ok(charRes._id);
        charRes.name = 'Fluffy';
        return request
          .patch(`/api/characters/${charRes._id}`)
          .send({ name: 'Fluffy' })
          .then(({ body: updatedChar }) => {
            assert.deepEqual(charRes, updatedChar);
          });
      });
  });
});
