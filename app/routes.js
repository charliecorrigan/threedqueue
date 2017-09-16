// app/routes.js
module.exports = function(app, passport) {
  const environment = process.env.NODE_ENV || "development"
  var configAuth = require('../config/auth_config')[environment]
  const Customer = require('./models/customer')
  const Project = require('./models/project')
  
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
    res.redirect(configAuth.dashboardUrl)
  });
  
  app.get('/projects/new', isLoggedIn, function(req, res) {
    res.render('projects/new.ejs', {
      user : req.user
    });
  });
  
  app.post('/projects', uploadFile, function(req, res) {
    console.log("POSTED!")
    console.log(req.body)
    console.log(req.user)
    // Customer.findOrCreateCustomer(req.user)
    Project.createNewProject(req.user, req.body)
    res.redirect('/dashboard');
  });
  
  app.get('*', function(req, res){
    res.send("404. The page you are looking for does not exist.", 404);
  });
};


const Dropbox = require('dropbox');

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/');
      }
  }

  function uploadFile(req, res, next) {
    var ACCESS_TOKEN = req.user.dbtoken
    var dbx = new Dropbox({ accessToken: ACCESS_TOKEN });
    var file = req.body.file
         
        // console.log("Uploading: " + filename); 
        // fstream = fs.createWriteStream(__dirname + '/files/' + filename);
        // file.pipe(fstream);
        // fstream.on('close', function () {
        //     res.redirect('back');
        // });
    });
    console.log("Here is a concatination..." + file + "...that should have been filename")
    dbx.filesUpload({path: '/' + file, contents: file})
      .then(function(response) {
        console.log("Umm...we're on line 96ish. I think that's good.");
        return next();
      })
      .catch(function(error) {
        console.error(error);
      });
    return false;
  }

