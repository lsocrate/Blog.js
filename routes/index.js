var Post = require('../models/post');
var User = require('../models/user');

exports.index = function(req, res){
  Post.find().populate('author', 'name', 'User').exec(function (err, posts) {
    if (err) return;

    res.render('index', {posts: posts});
  });
};
