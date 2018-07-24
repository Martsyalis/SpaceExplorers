const Router = require('express').Router;
const router = Router();
const Character = require('../models/character');
const spaceEvent = require('../models/event');

const getPrompts = actions =>
  actions.map(({ option }) => {
    return {
      text: option,
      action: option
    };
  });

const resolutions = {
  Attack: resolveAttack,
  Run: resolveRun,
  Diplomacy: resolveTalk
};
module.exports = router
  .get('/character/:id/event', (req, res, next) => {
    Character.findById(req.params.id)
      .then(character => {
        if (character.user != req.user.id)
          throw { code: 401, error: 'not your char' };
        if (character.currentEvent.event) return character;
        makeEvent().then(event => {
          character.currentEvent = { event, enemy: event.enemy };
          return character.save();
        });
      })
      .then(character => character.currentEvent.event)
      .then(({ scenario, actions }) => {
        res.send({
          result: {
            description: scenario,
            prompts: getPrompts(actions)
          }
        });
      })
      .catch(next);
  })

  .post('/character/:id/actions', (req, res, next) => {
    Character.findById(req.params.id)
      .then(character => {
        if (character.user !== req.user.id)
          throw { code: 401, error: 'authentication failed' };
      })
      .then(() => getAll(req.params.id))
      .then(({ enemy, ship, spaceEnv, char }) => {
        const result = {
          prompts: getPrompts(char.currentEvent.event.actions)
        };
        const resolve = resolutions[req.body.action];
        return resolve(char, enemy, ship, spaceEnv, result).then(resolved =>
          resolveAction(resolved, result, char)
        );
      })
      .then(result => res.send({ result }))
      .catch(next);
  });

function resolveAction(got, result, char) {
  result.description = got;
  if (result.resolved) {
    if (char.log.length > 5) result.win = true;
    return Character.update(
      { _id: char._id },
      {
        $push: { log: char.currentEvent.event._id },
        $set: { currentEvent: null }
      }
    ).then(() => result);
  } else {
    return Promise.resolve(result);
  }
}

function makeEvent() {
  return spaceEvent
    .aggregate([
      { $sample: { size: 1 } },
      {
        $lookup: {
          from: 'enemies',
          localField: 'enemy',
          foreignField: '_id',
          as: 'enemy'
        }
      },
      {
        $lookup: {
          from: 'spaceenvs',
          localField: 'spaceEnv',
          foreignField: '_id',
          as: 'spaceEnv'
        }
      },
      { $unwind: '$enemy' },
      { $unwind: '$spaceEnv' }
    ])
    .then(([event]) => event);
}

function getAll(id) {
  return Character.findById(id).then(char => {
    return {
      char,
      enemy: char.currentEvent.enemy,
      ship: char.ship,
      spaceEnv: char.currentEvent.event.spaceEnv
    };
  });
}

function resolveRun(char, enemy, ship, spaceEnv, result) {
  if (enemy.speed < ship.speed) {
    result.resolved = true;
    const description = char.currentEvent.event.actions[1].success.description;
    return Promise.resolve(description);
  }
  if (enemy.speed >= ship.speed) {
    ship.healthPoints -= enemy.damage + spaceEnv.damage + 30;
    return Character.findByIdAndUpdate(char._id, {
      'ship.healthPoints': ship.healthPoints
    }).then(() => {
      if (ship.healthPoints < 1) {
        result.resolved = true;
        result.lose = true;
        return `As you were trying to run, your ship was destroyed by ${
          enemy.name
        }. You died as a coward, with death coming at your back. Good job, loser`;
      }
      return `You tried to run but ${
        enemy.name
      } caught up and inflicted ${enemy.damage + spaceEnv.damage} damage.`;
    });
  }
}

function resolveTalk(char, enemy, ship, spaceEnv, result) {
  let random = Math.floor(Math.random() * 100);
  let difficulty = 30 + char.currentEvent.event.actions[2].difficulty;
  if (random > difficulty) {
    result.resolved = true;
    const description = char.currentEvent.event.actions[2].success.description;
    return Promise.resolve(description);
  } else {
    ship.healthPoints -= enemy.damage + spaceEnv.damage + 30;
    return Character.findByIdAndUpdate(char._id, {
      'ship.healthPoints': ship.healthPoints
    }).then(() => {
      if (ship.healthPoints < 1) {
        result.resolved = true;
        result.lose = true;
        return `as you were trying to explain your peaceful intentions ${
          enemy.name
        } shoot you for ${enemy.damage +
          spaceEnv.damage} damage. You died an idealist, till your last breath firmly believing that word is mightier then blaster. How wrong you were...`;
      }
      return `You tried to talk it out peacefully but ${
        enemy.name
      } decided to shoot you for ${enemy.damage +
        spaceEnv.damage} damage instead`;
    });
  }
}

function resolveAttack(char, enemy, ship, spaceEnv, result) {
  let shipDmg =
    spaceEnv.globalDmg + Math.floor(Math.random() * ship.damage) + ship.damage;
  enemy.healthPoints -= shipDmg;
  return Character.findByIdAndUpdate(char._id, {
    'currentEvent.enemy.healthPoints': enemy.healthPoints
  }).then(() => {
    if (enemy.healthPoints < 1) {
      result.resolved = true;
      const description = `${
        char.currentEvent.event.actions[0].success.description
      } you damaged ${enemy.name} for ${shipDmg} damage.`;
      return description;
    }
    let enemyDmg =
      Math.floor(Math.random() * enemy.damage) + enemy.damage + spaceEnv.damage;
    ship.healthPoints -= enemyDmg;
    return Character.findByIdAndUpdate(char._id, {
      'ship.healthPoints': ship.healthPoints
    }).then(() => {
      if (ship.healthPoints < 1) {
        result.resolved = true;
        result.lose = true;
        return `Your ship was destroyed by ${
          enemy.name
        }. Try again! Or don't. You already bought the game.`;
      }
      return `You damaged ${enemy.name} for ${ship.damage +
        spaceEnv.globalDmg} damage. Your ship took ${enemy.damage +
        spaceEnv.damage} damage.`;
    });
  });
}
