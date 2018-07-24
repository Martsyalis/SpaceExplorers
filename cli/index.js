const Game = require('./game');
const request = require('superagent');
const API_URL = 'https://zacIsLate.herokuapp.com/api';

let token = '';
const service = {
  signUp(info) {
    return request
      .post(`${API_URL}/auth/signup`)
      .send(info)
      .then(({ body }) => {
        token = body.token;
        return body;
      });
    //Should post a new user and return to game object with id and token property.
  },
  signIn(info) {
    return request
      .post(`${API_URL}/auth/signin`)
      .send(info)
      .then(({ body }) => {
        token = body.token;
        return body;
      });
    //Should get a user from the database and return an object to the id and token property.
  },
  getShips() {
    return request.get(`${API_URL}/ships`).then(res => res.body);
  },
  saveCharacter(characterData) {
    return request
      .post(`${API_URL}/newChar/${characterData['Character choice']}`)
      .set('Authorization', token)
      .send(characterData)
      .then(body => {
        return body;
      });
  },
  getCharacterTemplates() {
    return request
      .get(`${API_URL}/characters`)
      .set('Authorization', token)
      .then(({ body: newChar }) => newChar);
  },
  getCharacters(userId, usersToken) {
    return request
      .get(`${API_URL}/user/${userId}/characters`)
      .set('Authorization', usersToken)
      .then(({ body }) => {
        return body.userChars;
      });
    //Should return to the game an array of objects containing all characters corresponding to the userId.
  },
  loadEvent(characterId) {
    return request
      .get(`${API_URL}/game/character/${characterId}/event`)
      .set('Authorization', token)
      .then(({ body }) => {
        return body.result;
      });
    //Should return to a random event description object to the game.
  },
  resolveAction(option) {
    return request
      .post(`${API_URL}/game/character/${option.char_id}/actions`)
      .set('Authorization', token)
      .send(option)
      .then(({ body }) => {
        return body;
      });
    //Should return an event description object based an a provided option.
  }
};

const game = new Game(service);
game.start();
