const router = require('express').Router();
const SpaceEvent = require('../models/event');


module.exports = router
    .post('/', (req, res, next) => {
        const Events = Array.isArray(req.body) ? req.body : [req.body];
        Promise.all(Events.map(event => new SpaceEvent(event).save()))
            .then(got => {
                got.length < 2 ? res.json(got[0]) : res.json(got);
            })
            .catch(next);
    })

    .get('/', (req, res, next) => {
        SpaceEvent
            .find()
            .lean()
            .then(events => res.json(events))
            .catch(next);  
    })

    .put('/:id', (req, res, next) => {
        const id = req.params.id;
        if (!id) {
            next({ code: 404, error: `id ${id} does not exist`});
        }
        SpaceEvent.update({ _id: id }, req.body)
            .then(data => res.send(data))
            .catch(next);
    })

    .get('/:id', (req, res, next) => {
        SpaceEvent
            .findById(req.params.id)
            .lean()
            .populate('enemy', 'name')
            .then( event => {
                res.json(event);
            })
            .catch(next);
    })

    .delete('/:id', (req, res, next) => {
        SpaceEvent.findByIdAndRemove(req.params.id)
            .then(result => {
                const exist = result !=null;
                res.json({removed: exist });
            })
            .catch(next);
    })

    .patch('/:id', (req, res, next) => {
        SpaceEvent.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        )
            .lean()
            .then(mongoRes => res.send(mongoRes))
            .catch(next);
    });
