// Basic modules
// ==================================================================
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
// const Permission = require('helpers/permission');
const Crud = require('helpers/crud');
const User = require('models/user');

// Constants & Configs
// ==================================================================
const CONFIG = require('config');
const IS_DEV = (app.get('env') === 'development');

// Utility middlewares connection
// ==================================================================
const morgan = require('morgan');
const HttpError = require('helpers/error');

// Session middlewares connection
// ==================================================================
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWTSEED;
const jwtKey = process.env.JWTKEY;

// Logging
// ==================================================================
app.use(morgan(IS_DEV ? 'combined' : 'error'));

// Query params parsing
// ==================================================================
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

// Check that token is present and valid
// ===========================================================================
app.use((req, res, next) => {
  jwt.verify(req.headers['x-auth-token'], jwtSecret, (err, decoded) => {
    if (err || decoded.indexOf(jwtKey) !== 0) {
      res.status(403).json({error: 'Users service accepting calls only with gate verification token'});
    } else {
      next();
    }
  })
})

// get Permission.isAdmin(), 
// :id/put Permission.isOwner(), 
// :id/delete Permission.isOwner(), 

app.get('/auth', (req, res, next) => {
  User.findOne({username: req.query.username}).then(user => {
    if (user) {
      if (user.checkPassword(req.query.password)) {
        req.User = user;
        next();
      } else {
        next({status: 403, message: 'Incorrect password.'});
      }
    } else {
      next({status: 404, message: 'User not registred in a system.'});
    }
  }).catch(err => {
    next({status: 500, message: err.message });
  })
}, Crud.sendData('User'));

app.route('/')
  .get(Crud.readAll(User), Crud.sendData('User'))
  .post(Crud.createOne(User, ['email', 'username', 'password']), Crud.sendData('User'))
  .put(Crud.sendData('user'));

app.route('/:id')
  .get(Crud.readOne(User), Crud.sendData('User'))
  .put(Crud.modifyItem(User), Crud.sendData('User'))
  .delete(Crud.deleteOne(User), Crud.sendData('User'));

// Catch 404 and forward to error handler
// ==================================================================
app.use((req, res, next) => next(`Resource "${req.headers.host+req.url}" not found`));

// Error handling valid options are:
// ==================================================================
app.use((err, req, res, next) => {
  const errorInstance = new HttpError(err);
  console.error(err);
  res.status(errorInstance.status || 500).json(errorInstance.toJSON());
});

module.exports = app;