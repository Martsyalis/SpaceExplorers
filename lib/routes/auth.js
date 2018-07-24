const router = require('express').Router();
const User = require('../models/user');
const tokenService = require('../utils/token-service');

module.exports = router
  .post('/signup', (req, res, next) => {
    const { name, password } = req.body;
    delete req.body.password;
    delete req.body.roles;

    if (!password) throw { code: 400, error: 'password is required!' };

    User.nameExists(name)
      .then(exists => {
        if (exists)
          throw { code: 400, error: 'this Username is already taken' };

        const user = new User(req.body);
        user.generateHash(password);
        return user.save();
      })
      .then(user => {
        return tokenService
          .sign(user)
          .then(token => ({ token, userId: user._id }));
      })
      .then(result => res.send(result))
      .catch(next);
  })

  .post('/signin', (req, res, next) => {
    const { name, password } = req.body;
    delete req.body.password;

    if (!password) throw { code: 400, error: 'password is required' };

    User.findOne({ name })
      .populate('Characters')
      .then(user => {
        if (!user || !user.comparePassword(password)) {
          throw { code: 401, error: 'authentication failed' };
        }
        return tokenService.sign(user).then(token => ({
          token,
          userId: user._id,
          userChars: user.Characters
        }));
      })
      .then(result => res.send(result))
      .catch(next);
  });
