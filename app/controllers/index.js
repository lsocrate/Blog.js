var Post = require('../models/post');
var User = require('../models/user');

exports.index = function(req, res){
  Post.find().populate('author', 'name', 'User').sort({lastTouched: -1}).exec(function (err, posts) {
    if (err) return;

    var isViewerLogged = !!req.user;
    res.render('index', {posts: posts, isViewerLogged: isViewerLogged});
  });
};
exports.byTag = function(req, res){
  var tag = req.params.tag;
  Post.find({tags: {$all: [tag]}}).populate('author', 'name', 'User').sort({lastTouched: -1}).exec(function (err, posts) {
    if (err) return;

    var isViewerLogged = !!req.user;
    res.render('index', {posts: posts, isViewerLogged: isViewerLogged});
  });
};
