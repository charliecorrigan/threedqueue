var development_auth = require('./auth');

module.exports = {
  development: development_auth,
  production: {'dropboxAuth' : {
    'clientID'      : process.env.DROPBOX_AUTH_ID,
    'clientSecret'  : process.env.DROPBOX_AUTH_SECRET,
    'callbackURL'   : 'https://threedqueue.herokuapp.com/auth/dropbox/callback'},
    'dashboardUrl': 'https://threedqueue.herokuapp.com/dashboard'}
  }