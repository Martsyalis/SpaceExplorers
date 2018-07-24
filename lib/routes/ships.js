const router = require('express').Router();
const Ship = require('../models/ship');

module.exports = router
  .post('/', (req, res, next) => {
    new Ship(req.body)
      .save()
      .then(mongoRes => res.send(mongoRes))
      .catch(next);
  })

  .get('/', (req, res, next) => {
    Ship.find({})
      .lean()
      .then(mongoRes => res.send(mongoRes))
      .catch(next);
  })

  .get('/:id', (req, res, next) => {
    Ship.findById(req.params.id)
      .lean()
      .then(mongoRes => {
        if (!mongoRes) {
          res.statusCode = 404;
          res.send(`id: ${req.params.id} does not exist`);
        } else res.json(mongoRes);
      })
      .catch(next);
  })

  .put('/:id', (req, res, next) => {
    const id = req.params.id;
    if (!id) {
      next({ code: 404, error: `id ${id} does not exist` });
    }
    Ship.update({ _id: id }, req.body, (err, data) => res.send(data));
  })

  .delete('/:id', (req, res, next) => {
    Ship.findByIdAndRemove(req.params.id)
      .then(result => {
        const exist = result != null;
        res.json({ removed: exist });
      })
      .catch(next);
  })

  .patch('/:id', (req, res, next) => {
    Ship.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
      .lean()
      .then(mongoRes => res.send(mongoRes))
      .catch(next);
  });
