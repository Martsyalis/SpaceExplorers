const Router = require('express').Router;
const router = Router();
const Character = require('../models/character');

module.exports = router

    .post('/', (req, res, next) => {
        new Character(req.body).save()
            .then(result => res.json(result))
            .catch(next);
    })

    .get('/:id', (req, res, next) => {
        const characterId = req.params.id;
        Character.findById(characterId)
            .lean()
            .then(character => {
                res.json(character);
            })
            .catch(next);
    })

    .get('/', (req, res, next) => {
        Character.find()
            .lean()
            .then(result => res.json(result))
            .catch(next);
    })

    .put('/:id', (req, res, next) => {
        const id = req.params.id;
        if (!id) {
            next({ code: 404, error: `id ${id} does not exist`});
        }
        Character.update({ _id: id }, req.body, (err, data) => res.send(data));
    })

    .delete('/:id', (req, res, next) => {
        Character.findByIdAndRemove(req.params.id)
            .then(result => {
                const exist = result !=null;
                res.json({removed: exist });
            })
            .catch(next);
    })

    .patch('/:id', (req, res, next) => {
        Character.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        )
            .lean()
            .then(mongoRes => res.send(mongoRes))
            .catch(next);
    });