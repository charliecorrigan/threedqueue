// config/passport.js

// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;

// load up the user model
var Admin            = require('../app/models/admin');

// expose this function to our app using module.exports
module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(admin, done) {
      done(null, admin);
    });
    
    passport.deserializeUser(function(admin, done) {
      done(null, admin);
    });

    // passport.serializeUser(function(user, done) {
    //   console.log("In the serializer. User is...")
    //   console.log(user)
    //     done(null, user.id);
    // });

    // // used to deserialize the user
    // passport.deserializeUser(function(id, done) {
    //     Admin.findById(id, function(err, user) {
    //         done(err, user);
    //     });
    // });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {
        console.log("Made it to passport.js line 43")
        // asynchronous
        // User.findOne wont fire unless data is sent back
        process.nextTick(function() {

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        Admin.findOne(email).then(function(data) {
            console.log("We have progressed to passport.js line 52, inside admin.findOne")
            // check to see if theres already a user with that email
            if (data.rows > 0) {
                console.log("data.rows were greater than zero. The email was taken")
                return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
            } else {
              console.log("data.rows were zero. The email was is available. Proceed to next bit...")
                // if there is no user with that email
                // create the user
                var newAdmin            = new Admin();

                // set the user's local credentials
                newAdmin.email    = email;
                newAdmin.password = newAdmin.generateHash(password);
                console.log("NewAdmin is...")
                console.log(newAdmin)
                // save the user
                newAdmin.save().then(data => {
                  return done(null, newAdmin)
                })



                //   .then(function(err) {
                //     if (err)
                //         throw err;
                //     return done(null, newAdmin);
                // });
            }

        });    

        });

    }));
        // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-login', new LocalStrategy({
      // by default, local strategy uses username and password, we will override with email
      usernameField : 'email',
      passwordField : 'password',
      passReqToCallback : true // allows us to pass back the entire request to the callback
  },
  function(req, email, password, done) { // callback with email and password from our form

      // find a user whose email is the same as the forms email
      // we are checking to see if the user trying to login already exists
      Admin.findOne(email).then(function(data) {
        console.log("We're loggin in and the data.rows are...")
        console.log(data.rows[0].password)
        console.log(Admin.validPassword(password, data.rows[0].password))
      // Admin.findOne({ 'local.email' :  email }, function(err, admin) {
      //     // if there are any errors, return the error before anything else
      //     if (err)
      //         return done(err);

          // if no user is found, return the message
          if (data.rows < 1)
              return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash

          // if the user is found but the password is wrong
          if (!Admin.validPassword(password, data.rows[0].password))
              return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

          // all is well, return successful user
          return done(null, data.rows[0]);
      });

  }));


};
