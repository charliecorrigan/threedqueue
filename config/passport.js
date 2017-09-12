var LocalStrategy   = require('passport-local').Strategy;
var DropboxOAuth2Strategy = require('passport-dropbox-oauth2').Strategy
var Admin            = require('../app/models/admin');
var configAuth = require('./auth');

module.exports = function(passport) {

  passport.serializeUser(function(admin, done) {
    done(null, admin);
  });

  passport.deserializeUser(function(admin, done) {
    done(null, admin);
  });

  passport.use('local-signup', new LocalStrategy({
      usernameField : 'email',
      passwordField : 'password',
      passReqToCallback : true
    },
    function(req, email, password, done) {
      process.nextTick(function() {
        Admin.findOne(email).then(function(data) {
          if (data.rowCount > 0) {
            return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
          } else {
            var newAdmin            = new Admin();
            newAdmin.email    = email;
            newAdmin.password = newAdmin.generateHash(password);
            newAdmin.save().then(data => {
              return done(null, newAdmin)
            })
          }
        });
      });
  }));

  passport.use('local-login', new LocalStrategy({
      usernameField : 'email',
      passwordField : 'password',
      passReqToCallback : true
    },
    function(req, email, password, done) {
      Admin.findOne(email).then(function(data) {
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
      callbackURL: configAuth.dropboxAuth.callbackURL
    },

    // facebook will send back the token and profile
    function(accessToken, refreshToken, profile, done) {
      
              // asynchronous
              process.nextTick(function() {
                console.log("Here is the token:")
                console.log(accessToken)
                return done(null, profile)
              //   // COMMENTING OUT EVERYTHING BELOW. FOR A MINUTE
              //     // find the user in the database based on their facebook id
              //     User.findOne({ 'facebook.id' : profile.id }, function(err, user) {
      
              //         // if there is an error, stop everything and return that
              //         // ie an error connecting to the database
              //         if (err)
              //             return done(err);
      
              //         // if the user is found, then log them in
              //         if (user) {
              //             return done(null, user); // user found, return that user
              //         } else {
              //             // if there is no user found with that facebook id, create them
              //             var newUser            = new User();
      
              //             // set all of the facebook information in our user model
              //             newUser.facebook.id    = profile.id; // set the users facebook id                   
              //             newUser.facebook.token = token; // we will save the token that facebook provides to the user                    
              //             newUser.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned
              //             newUser.facebook.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first
      
              //             // save our user to the database
              //             newUser.save(function(err) {
              //                 if (err)
              //                     throw err;
      
              //                 // if successful, return the new user
              //                 return done(null, newUser);
              //             });
              //         }
      
              //     });
              });
      
          }));
      
};
