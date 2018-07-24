const assert = require('chai').assert;
const Event = require('../../lib/models/event');

describe('event model', () => {
  it('validates a good event model', () => {
    const event = new Event({
      scenario:
        'You have encountered an Advanced Cylon War Raider Battalion inside of an asteroid field!',
      spaceEnv: '590643bc2cd3da2808b0e651',
      enemy: '590643bc2cd3da2808b0e651',
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
    });
    assert.equal(event.validateSync(), undefined);
  });

  it('checks for required fields', () => {
    const event = new Event({});
    const { errors } = event.validateSync();
    assert.equal(errors.scenario.kind, 'required');
    assert.equal(errors.spaceEnv.kind, 'required');
    assert.equal(errors.enemy.kind, 'required');
  });
});
