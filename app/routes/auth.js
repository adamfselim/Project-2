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
    db.Userdeck.findAll({ where: { userId: req.user.id, status: "active" }, include: [db.Usercard] })
      .then(function (dbPost) {
          res.json(dbPost);
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

  // Route for updating deck list in user deck
  app.post("/api/cards/card", function (req, res) {
    console.log('Checking to see if card is already in deck.');
    console.log('Card Name to add: ' + req.body.card_name + '.  Card ID: ' + req.body.id + '.  User ID: ' + req.user.id);
    db.Userdeck.findOne({ where: { userId: req.user.id, status: "active",  }, include: [{model:db.Usercard, where: { card_id: req.body.id}}] })
      .then(function (dbPost) {
        if (dbPost) {
          // increment qnty unless greater than 4!
          if (dbPost.Usercards[0].card_qnty < 4){
            console.log("Less than 4 cards currently");
            var tempQnty = dbPost.Usercards[0].card_qnty +1;
            var updateValues = {
              card_qnty: tempQnty
            };
            db.Usercard.update(updateValues, { where: { id: dbPost.Usercards[0].id} })
              .then( function (cardPost) {
                console.log(cardPost);
              });
          }
          var tempData = JSON.stringify(dbPost);
          console.log("Card Already Exists!" );
          console.log("Qnty: " , dbPost.Usercards[0].card_qnty);
        } else {
          // Add a new card!
          db.Userdeck.findOne({ where: { userId: req.user.id, status: "active" }})
          .then(function (data) {
          var newCard =
          {
            card_id: req.body.id,
            card_qnty: "1",
            UserdeckId: data.id
          };
          db.Usercard.create(newCard);
          console.log("Card Does not exist: ");
          console.log(data.id);
          });
        }
      });
    res.status(200).send();
    res.redirect("/dashboard")
    return;
  });

}