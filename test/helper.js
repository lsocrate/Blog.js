var mongoose = require('mongoose');
var async = require('async');
var User = mongoose.model('User')
var Post = mongoose.model('Post');

exports.clearDb = function (done) {
  async.parallel([
    function (cb) {
      User.collection.remove(cb)
    },
    function (cb) {
      Post.collection.remove(cb)
    }
  ], done)
}
