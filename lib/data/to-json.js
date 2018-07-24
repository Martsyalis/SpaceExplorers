var jsonfile = require('jsonfile');
const charData = require('./characters.js');
const userData = require('./users.js');
const shipData = require('./ships.js');
const enemiesData = require('./enemies.js');
const eventsData = require('./events.js');
const spaceEnvData = require('./spaceEnv.js');

jsonfile.writeFile(
  __dirname + '/characters.json',
  charData,
  { spaces: 2, EOL: '\r\n' },
  function(err) {
    console.error(err); //eslint-disable-line
  }
);

jsonfile.writeFile(
  __dirname + '/users.json',
  userData,
  { spaces: 2, EOL: '\r\n' },
  function(err) {
    console.error(err); //eslint-disable-line
  }
);

jsonfile.writeFile(
  __dirname + '/ships.json',
  shipData,
  { spaces: 2, EOL: '\r\n' },
  function(err) {
    console.error(err); //eslint-disable-line
  }
);

jsonfile.writeFile(
  __dirname + '/enemies.json',
  enemiesData,
  { spaces: 2, EOL: '\r\n' },
  function(err) {
    console.error(err); //eslint-disable-line
  }
);

jsonfile.writeFile(
  __dirname + '/events.json',
  eventsData,
  { spaces: 2, EOL: '\r\n' },
  function(err) {
    console.error(err); //eslint-disable-line
  }
);

jsonfile.writeFile(
  __dirname + '/spaceEnvs.json',
  spaceEnvData,
  { spaces: 2, EOL: '\r\n' },
  function(err) {
    console.error(err); //eslint-disable-line
  }
);
