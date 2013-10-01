var User = require('../models/user');

exports.signin = function(req, res){
  res.render('user/signin', { title: 'Signin', thisPage: 'only-a-form'});
};

exports.getSignup = function(req, res){
  res.render('user/signup', { title: 'Signup', thisPage: 'only-a-form'});
};

exports.postSignup = function(req, res){
  var name = req.body.name;
  var email = req.body.email;
  var password = req.body.password;

  var newUser = new User({
    name: name,
    email: email,
    password: password
  });

  newUser.save(function(err, user){
    if (err) return;

    req.login(user, function (err) {
      if (err) return next(err);

      return res.redirect('/');
    });
  });
};
