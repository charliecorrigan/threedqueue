// app/routes.js
module.exports = function(app, passport) {

  app.get('/', function(req, res) {
    res.render('index.ejs');
  });

  app.get('/login', function(req, res) {
    res.render('login.ejs', { message: req.flash('loginMessage') });
  });

  app.post('/login', passport.authenticate('local-login', {
    successRedirect : '/dashboard', // redirect to the secure profile section
    failureRedirect : '/login', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
  }));

  app.get('/signup', function(req, res) {
    res.render('signup.ejs', { message: req.flash('signupMessage') });
  });

  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/dropbox', // redirect to the secure profile section
    failureRedirect : '/signup', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
  }));

  app.get('/dashboard', isLoggedIn, function(req, res) {
    res.render('dashboard.ejs', {
      user : req.user
    });
  });

  app.get('/dropbox', isLoggedIn, function(req, res) {
    res.render('dropbox.ejs', {
      user : req.user
    });
  });

  app.get('/logout', function(req, res) {
      req.logout();
      res.redirect('/');
  });

  app.get('/auth/dropbox', passport.authorize('dropbox-oauth2'));

  app.get('/auth/dropbox/callback', passport.authorize('dropbox-oauth2', { failureRedirect: 'http://localhost:8080/dropbox' }),
  function(req, res) {
    console.log("Seriously. WTF")
    // Successful authentication, redirect home.
    res.redirect('http://localhost:8080/dashboard');
  });
};

  function isLoggedIn(req, res, next) {
      if (req.isAuthenticated()) {
          console.log("Authentication Successful! Yay!")
          return next();
      } else {
          res.redirect('/');
      }
  }

