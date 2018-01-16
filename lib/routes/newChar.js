const Router = require('express').Router;
const router = Router();
const Character = require('../models/character');
const User = require('../models/user');
const Ship = require('../models/ship');


module.exports = router
    .post('/:id', (req, res, next) => {
        const charData = req.body;
        Promise.all([
            Ship.findById(charData.ship).lean(),
            Character.findById(req.params.id)
        ])
            .then(([ship, char]) => {
                return new Character({
                    name: char.name,
                    description: char.description,
                    template: false,
                    ship,
                    user: req.user.id,
                }).save();
            })
            .then(({ _id }) => {
                return User
                    .findByIdAndUpdate(req.user.id, {Characters: _id})
                    .then(() => res.send({ charId: _id}));
            })
            .catch(next);
    });