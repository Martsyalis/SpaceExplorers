const request = require('./request');
const assert = require('chai').assert;
const db = require('./db');

describe('actions API', () => {
  beforeEach(() => db.drop());

  let savedEnvironment = null;
  let savedEnemy = null;
  let testEvent = null;
  let savedChar = null;
  let token = null;
  let savedUser = null;

  const ship = {
    name: 'Moya',
    healthPoints: 1000,
    damage: 100,
    description: 'A living sentient bio-mechanical space ship.',
    class: 'Leviathan',
    speed: 50
  };

  const enemy = {
    name: 'Advanced Cylon War Raider Battalion',
    damage: 25,
    healthPoints: 100,
    speed: 20
  };

  const environment = {
    name: 'Astroid Field',
    damage: 25,
    description:
      'The asteroid belt is the circumstellar disc in the Solar System located roughly between the orbits of the planets Mars and Jupiter. It is occupied by numerous irregularly shaped bodies called asteroids or minor planets.',
    globalDmg: 15
  };

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
        savedUser = body.userId;
      });
  });

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
      return request.post('/api/events').send(testEvent);
    });
  });

  beforeEach(() => {
    return request
      .post('/api/characters')
      .set('Authorization', token)
      .send({
        name: 'Ford Prefect',
        description: 'human/alien travel writer',
        user: savedUser,
        ship: ship
      })
      .then(({ body }) => (savedChar = body));
  });

  it('checks if getEvent is working', () => {
    return request
      .get(`/api/game/character/${savedChar._id}/event`)
      .set('Authorization', token)
      .then(got => {
        assert.ok(got);
      });
  });

  it(' checks if post action is working for attack', () => {
    return request
      .get(`/api/game/character/${savedChar._id}/event`)
      .set('Authorization', token)
      .then(() => {
        return request
          .post(`/api/game/character/${savedChar._id}/actions`)
          .set('Authorization', token)
          .send({ action: 'Attack' });
      })
      .then(({ body }) => {
        assert.ok(body.result.description);
      });
  });

  it('checks run', () => {
    return request
      .get(`/api/game/character/${savedChar._id}/event`)
      .set('Authorization', token)
      .then(() => {
        return request
          .post(`/api/game/character/${savedChar._id}/actions`)
          .set('Authorization', token)
          .send({ action: 'Run' });
      })
      .then(({ body }) => {
        assert.ok(body.result.description);
      });
  });
});
