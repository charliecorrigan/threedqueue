module.exports = function(app, passport, fileUpload) {
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
    successRedirect : '/dashboard',
    failureRedirect : '/login',
    failureFlash : true
  }));

  app.get('/signup', function(req, res) {
    res.render('signup.ejs', { message: req.flash('signupMessage') });
  });

  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/dropbox',
    failureRedirect : '/signup',
    failureFlash : true
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

  app.post('/projects', isLoggedIn, uploadFile, function(req, res) {
    Project.createNewProject(req.user, req.body)
    // res.redirect('/projects/success.ejs');
    res.render('projects/success.ejs', {
      user : req.user
    });
  });

  app.get('/admin/manage-accounts', isLoggedIn, function(req, res) {
    res.render('admin/manage-accounts.ejs', {
      user : req.user
    });
  });

  app.get('/admin/manage-projects', isLoggedIn, function(req, res) {
    res.render('admin/manage-projects.ejs', {
      user : req.user
    });
  });

  app.get('/admin/manage-queue', isLoggedIn, function(req, res) {
    res.render('admin/manage-queue.ejs', {
      user : req.user
    });
  });

  app.get('/admin/statistics-reporting', isLoggedIn, function(req, res) {
    res.render('admin/statistics-reporting.ejs', {
      user : req.user
    });
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
    var file = req.files.file
    req.body.file_path = file.name
    dbx.filesUpload({path: '/' + file.name, contents: file.data})
      .then(function(response) {
        return next();
      })
      .catch(function(error) {
        console.error(error);
      });
    return false;
  }

