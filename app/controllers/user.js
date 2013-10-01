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

  if (!name) {
    return res.render('user/signup', { title: 'Signup', thisPage: 'only-a-form', alert: {message: 'Please fill your name'}, email: email});
  }
  if (!email) {
    return res.render('user/signup', { title: 'Signup', thisPage: 'only-a-form', alert: {message: 'Please fill your email'}, name: name});
  }
  if (!password) {
    return res.render('user/signup', { title: 'Signup', thisPage: 'only-a-form', alert: {message: 'Please fill your password'}, name: name, email: email});
  }


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

exports.getChangePassword = function(req, res){
  res.render('user/changepassword', { title: 'Signup', thisPage: 'only-a-form'});
};

exports.postChangePassword = function(req, res){
  var password = req.body.password;

  User.findOne({_id: req.user._id}).exec(function (err, user) {
    if (err) return;

    user.password = password;
    user.save(function (err, user) {
      if (err) return;

      return res.redirect('/');
    });
  });
};
