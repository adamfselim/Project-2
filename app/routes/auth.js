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

  app.get('/api/check/', function (req, res) {
    db.Userdeck.findOne({ where: { userId: req.user.id } })
      .then(function (dbPost) {
        if (dbPost) {
          console.log("User Deck Exists" + dbPost);
          res.json(dbPost);
        } else {
          console.log("No Deck for this User" + dbPost);
          var val = Math.floor(1000 + Math.random() * 9000);
          console.log("deck" + val);
          var data =
          {
            deck_name: "deck" + val,
            status: "active",
            notes: "",
            userId: req.user.id
          };
          db.Userdeck.create(data);
          console.log("Deck Created and set to active");
          res.json(dbPost);
        }
      });
  });

  app.get("/api/cards/left/", function (req, res) {
    db.Mtgcard.findAll({ limit: 30 })
      .then(function (dbPost) {
        res.json(dbPost);
      });
  });

  app.get("/api/cards/right/", function (req, res) {
    db.Userdeck.findOne({ where: { status: "active", userId: req.user.id }, include: [db.Usercard] })
      .then(function (dbPost) {
        res.json(dbPost);
        // console.log(req.user.id);
      });
  });

  // Get route for returning posts of a specific category
  app.get("/api/cards/left/category/:category", function (req, res) {
    db.Mtgcard.findAll({
      where: {
        card_color_identity: req.params.category
      },
      limit: 30
    })
      .then(function (dbPost) {
        res.json(dbPost);
      });
  });

  // Get route for retrieving a single card by ID from the mtg deck
  app.get("/api/cards/:id", function (req, res) {
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
  app.post("/api/cards/card", function (req, res) {

    db.Usercard.findOne({ where: { card_id: req.body.id, UserdeckId: req.user.id }})
      .then(function (dbPost) {
        // res.json(dbPost);
        console.log("Card DBPOST: " + dbPost);
        if (dbPost) {
          // db.usercard.update({card_qnty: sequelize.literal(card_qnty +1)}
          // // increment qnty unless greater than 4!
          console.log("Card Already Exists!");
        } else {
          // add card!
          // var data =
          // {
          //   card_id: req.body.id,
          //   card_qnty: "1",
          //   UserdeckId: req.body.id
          // };
          // db.Usercard.create(data);
          console.log("Card Does not exist");
          console.log(dbPost);
        }
      });
    console.log("Express post: " + req.body.card_name, req.body.id, req.user.id);
    res.status(200).send();
    return;
  });

}