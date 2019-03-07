var exports = module.exports = {}

exports.signup = function (req, res) {
  let goodsignup = {
    signup: true
  }
  res.render('signup', goodsignup);
}

exports.signin = function (req, res) {
  let goodsignin = {
    signin: true
  }
  res.render('signin', goodsignin);
}

exports.dashboard = function (req, res) {
  let gooddashboard = {
    dashboard: true,
    userEmail: req.user.email
  }
  res.render('dashboard', gooddashboard);
}

exports.logout = function (req, res) {
  req.session.destroy(function (err) {
    res.redirect('/');
  });
}
