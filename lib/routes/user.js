const router = require('express').Router();
const User = require('../models/user');
const checkAuth = require('../utils/check-auth');

module.exports = router
    .get('/:id/characters', checkAuth(), (req, res, next) =>{
        User.findById(req.params.id)
            .select('Characters')
            .populate('Characters')
            .lean()
            .then(user => user.Characters)
            .then(userChars => {
                res.send({ userChars });
            })
            .catch(next);
    });