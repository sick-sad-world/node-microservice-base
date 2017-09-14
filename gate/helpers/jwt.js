const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWTSEED;
const jwtKey = process.env.JWTKEY;

module.exports = function createJwtHeader(role = 'guest') {
  return jwt.sign(`${jwtKey}-${role}`, jwtSecret)
}