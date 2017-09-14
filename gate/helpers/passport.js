const request = require('request-promise');
const CONFIG = require('config');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const createJwtHeader = require('./jwt');

// Srialize User to session
// ==================================================================
passport.serializeUser((account, cb) => {
  console.log('serialize', account);
  cb(null, account.id);
});

// Get User from session
// ==================================================================
passport.deserializeUser((id, cb) => {
  request({
    uri: `${CONFIG.services['/users']}/${id}`,
    json: true,
    headers: {
      'x-auth-token': createJwtHeader()
    }
  })
  .then((acc) => {
    console.log('deserialize', acc);
    cb(null, acc)
  }).catch(({error}) => {
    console.error('deserialize', error);
    cb(error)
  });
});

// Configure local auth Strategy
// ==================================================================
passport.use(new LocalStrategy((username, password, cb) => {
  request({
    uri: `${CONFIG.services['/users']}/auth`,
    qs: {
      username,
      password
    },
    json: true,
    headers: {
      'x-auth-token': createJwtHeader()
    }
  })
  .then((acc) => cb(null, acc))
  .catch(({error}) => {
    if (error.status > 403) {
      cb(error);
    } else {
      cb(null, false, error.message);
    }
  });
}));

module.exports = passport;