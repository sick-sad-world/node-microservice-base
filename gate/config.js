module.exports = {
  host: 'http://localhost',
  port: 3000,
  session: {
    name: 'app_gate',
    secret: 'gate-token-secret',
    key: 'appgate'
  },
  services: {
    '/users': 'http://localhost:3002'
  }
};