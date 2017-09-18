var LocalStrategy   = require('passport-local').Strategy;
var DropboxOAuth2Strategy = require('passport-dropbox-oauth2').Strategy
var Admin            = require('../app/models/admin');
// var configAuth = require('./auth');
const environment = process.env.NODE_ENV || "development"
var configAuth = require('./auth_config')[environment]

module.exports = function(passport) {

  passport.serializeUser(function(admin, done) {
    done(null, admin);
  });

  passport.deserializeUser(function(admin, done) {
    done(null, admin);
  });

  passport.use('local-signup', new LocalStrategy({
      usernameField : 'username',
      passwordField : 'password',
      passReqToCallback : true
    },
    function(req, username, password, done) {
      process.nextTick(function() {
        Admin.findOne(username).then(function(data) {
          if (data.rowCount > 0) {
            return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
          } else {
            var newAdmin            = new Admin();
            newAdmin.email          = req.body.email;
            newAdmin.password       = newAdmin.generateHash(password);
            newAdmin.organization   = req.body.organization
            newAdmin.username       = username
            newAdmin.save().then(data => {
              console.log("After the save admin function.")
              console.log("The following should be the new admin data. Look for the id and make sure it's not 0:")
              console.log(data)
              console.log("The following should be the newAdmin. Look for the id and make sure it's not 0:")
              console.log(newAdmin)
              return done(null, data.rows[0])
            })
          }
        });
      });
  }));

  passport.use('local-login', new LocalStrategy({
      usernameField : 'username',
      passwordField : 'password',
      passReqToCallback : true
    },
    function(req, username, password, done) {
      Admin.findOne(username).then(function(data) {
        if (data.rowCount < 1)
          return done(null, false, req.flash('loginMessage', 'No user found.'));
        if (!Admin.validPassword(password, data.rows[0].password))
          return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
        return done(null, data.rows[0]);
      });
    }));

    passport.use(new DropboxOAuth2Strategy({
      apiVersion: '2',
      clientID: configAuth.dropboxAuth.clientID,
      clientSecret: configAuth.dropboxAuth.clientSecret,
      callbackURL: configAuth.dropboxAuth.callbackURL,
      passReqToCallback : true
    },

    function(req, accessToken, refreshToken, profile, done) {
      process.nextTick(function() {
        Admin.findOne(req.user.username).then(function(data) {
          Admin.updateToken(data.rows[0].id, accessToken).then(function(data) {
            return done(data.rows[0])
          })
          return done(data.rows[0]);
        });
        req.user.dbtoken = accessToken
        return done(null, req.user)

      });
    }));
};
