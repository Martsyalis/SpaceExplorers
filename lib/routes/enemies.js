const router = require('express').Router();
const Enemy = require('../models/enemy');

module.exports = router
  .post('/', (req, res, next) => {
    const Enemies = Array.isArray(req.body) ? req.body : [req.body];
    Promise.all(Enemies.map(enemy => new Enemy(enemy).save()))
      .then(got => {
        got.length < 2 ? res.json(got[0]) : res.json(got);
      })
      .catch(next);
  })

  .get('/', (req, res, next) => {
    Enemy.find()
      .lean()
      .then(enemies => res.json(enemies))
      .catch(next);
  })

  .get('/:id', (req, res, next) => {
    Enemy.findById(req.params.id)
      .then(enemy => res.json(enemy))
      .catch(next);
  })

  .put('/:id', (req, res, next) => {
    const id = req.params.id;
    if (!id) {
      next({ code: 404, error: `id ${id} does not exist` });
    }
    Enemy.update({ _id: id }, req.body, (err, data) => res.send(data));
  })

  .delete('/:id', (req, res, next) => {
    Enemy.findByIdAndRemove(req.params.id)
      .then(result => {
        const exist = result != null;
        res.json({ removed: exist });
      })
      .catch(next);
  })

  .patch('/:id', (req, res, next) => {
    Enemy.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
      .lean()
      .then(mongoRes => res.send(mongoRes))
      .catch(next);
  });
