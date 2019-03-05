var authController = require('../controllers/authcontroller.js');
var db = require("../models");

module.exports = function (app, passport) {

  app.get('/', function (req, res) {
    res.redirect('/signin');
  });

  app.get('/signup', authController.signup);

  app.get('/signin', authController.signin);

  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/dashboard',
    failureRedirect: '/signup'
  }
  ));

  app.get('/dashboard', isLoggedIn, authController.dashboard);

  app.get('/logout', authController.logout);

  app.post('/signin', passport.authenticate('local-signin', {
    successRedirect: '/dashboard',
    failureRedirect: '/signin'
  }
  ));

  function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
      return next();
    res.redirect('/signin');
  }

  // routes for dashboard
  // GET route for getting all of the cards, limited to x on the left side.
  app.get("/api/posts/left/", function (req, res) {
    db.Mtgcard.findAll({ limit: 30 })
      .then(function (dbPost) {
        res.json(dbPost);
      });
  });

  app.get("/api/posts/right/", function (req, res) {
    db.Userdeck.findAll({ limit: 60 })
      .then(function (dbPost) {
        res.json(dbPost);
      });
  });

  // Get route for returning posts of a specific category
  app.get("/api/posts/left/category/:category", function (req, res) {
    db.Mtgcard.findAll({
      where: {
        card_color_identity: req.params.category
      },
      limit: 20
    })
      .then(function (dbPost) {
        res.json(dbPost);
      });
  });

  // Get route for retrieving a single card by ID from the mtg deck
  app.get("/api/posts/:id", function (req, res) {
    db.Mtgcard.findOne({
      where: {
        id: req.params.id
      }
    })
      .then(function (dbPost) {
        res.json(dbPost);
      });
  });

  // PUT route for updating deck list in user deck
  app.post("/api/posts/card", function (req, res) {

    // db.Userdeck.update(
    //   {
    //     deck_list
    //   })
    //   .then(function(dbPost) {
    //     res.json(dbPost);
    //   });
    console.log("Express post: " + req.body.card_name);
    res.status(200).send();
    return;
  });

}