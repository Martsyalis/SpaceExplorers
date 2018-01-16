const express = require('express');
const app = express();
const errorHandler = require('./utils/error-handler');
const morgan = require('morgan');
const checkAuth = require('./utils/check-auth');

// ### middleware ###
app.use(express.json());
app.use(morgan('dev'));
app.use(express.static('./public'));

// ### required routes ###
const user = require('./routes/user');
const newChar = require('./routes/newChar');
const auth = require('./routes/auth');
const enemy = require('./routes/enemies');
const ships = require('./routes/ships');
const spaceEnvs = require('./routes/spaceEnvs');
const characters = require('./routes/characters');
const events = require('./routes/events');
const actions = require('./routes/actions');

// ### used routes ###
app.use('/api/auth', auth);
app.use('/api/user',checkAuth(), user);
app.use('/api/newChar', checkAuth(), newChar);
app.use('/api/game', checkAuth(), actions);
app.use('/api/auth', checkAuth(), auth);
app.use('/api/enemies', checkAuth(), enemy);
app.use('/api/ships', checkAuth(), ships);
app.use('/api/spaceEnvs', checkAuth(), spaceEnvs);
app.use('/api/characters', checkAuth(), characters);
app.use('/api/events', checkAuth(), events);

// ### catchers ###
app.use(errorHandler());

module.exports = app;