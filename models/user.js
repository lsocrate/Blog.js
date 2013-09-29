var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var Schema = mongoose.Schema;
var UserSchema = new Schema({
  name: String,
  email: {
    type:String,
    index: {
      unique: true,
      dropDups: true
    }
  },
  hashed_password: String
});

UserSchema.virtual('password').set(function (password) {
  this._password = password;
  this.hashed_password = this.encryptPassword(password);
}).get(function () {
  return this._password;
});

UserSchema.methods = {
  encryptPassword: function (password) {
    if (!password.length) return '';

    var salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  },
  authenticate: function (plainText) {
    return bcrypt.compareSync(plainText, this.hashed_password);
  }
};

module.exports = mongoose.model('User', UserSchema);
