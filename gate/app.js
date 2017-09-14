// Basic modules
// ==================================================================
const path = require('path');
const url = require('url');
const express = require('express');
const proxy = require('proxy-middleware');
const app = express();

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
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('helpers/passport');

// JWT signature modules
// ===========================================================================
const createJwtHeader = require('helpers/jwt');

// Logging
// ==================================================================
app.use(morgan(IS_DEV ? 'combined' : 'error'));

// Cookies and sessions implementation
// ==================================================================
app.use(cookieParser());
app.use(session(Object.assign(CONFIG.session, {
  resave: false,
  saveUninitialized: true
})));
app.use(passport.initialize());
app.use(passport.session());

// Create proxies from CONFIG list of services
// ===========================================================================
Object.keys(CONFIG.services).forEach((route) => {
  app.use(route, (req, res, next) => {
    req.headers['x-auth-token'] = createJwtHeader(req.user && req.user.role)
    next();
  }, proxy(Object.assign(url.parse(CONFIG.services[route]), {
    preserveHost: true
  })));
});

app.use('/auth', bodyParser.json());
app.use('/auth', bodyParser.urlencoded({extended: false}));

app.post('/auth/login', (req, res, next) => {
  passport.authenticate('local', (err, user) => {
    if (err) return next(err);
    req.user = user;
    req.logIn(user, (err) => (err) ? next(err) : next())
  })(req, res);
}, (req, res, next) => res.json(req.user));

// Logout route
// ===========================================================================
app.post('/auth/logout', (req, res) => {
  req.logout();
  res.json({message: 'Logged out successfully.'});
});

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