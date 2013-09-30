var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports = function (passport) {
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findOne({_id: id}, function (err, user) {
      done(err, user);
    });
  });

  passport.use(new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password'
    },
    function (email, password, callback){
      User.findOne({email: email}, function (err, user) {
        if (err) {
          return callback(err);
        }

        if (!user || !user.authenticate(password)) {
          return callback(null, false, {message: 'Incorrect user and password combination'})
        }

        return callback(null, user);
      });
    }
  ));
}
