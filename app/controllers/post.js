var Post = require('../models/post');

exports.createPostPage = function(req, res) {
  res.render('post/create');
};

exports.createPost = function(req, res) {
  var title = req.body.title;
  var content = req.body.content;
  var tagsString = req.body.tags;
  var tags = tagsString.split(',').map(function(tag){return tag.trim();});
  var postId = req.params.id;

  var newPost = new Post({
    title: title,
    content: content,
    tags: tags,
    author: req.user._id
  });

  newPost.save(function (err, post) {
    if (err) return

    return res.redirect('/');
  });
};

exports.read = function(req, res){
  Post.findOne({_id: req.params.id}).populate('author', 'name', 'User').exec(function (err, post) {
    if (err) return;

    post.comments.reverse();
    res.render('post/read', {post: post, commentCount: post.comments.length});
  });
};

exports.edit = function(req, res){
  Post.findOne({_id: req.params.id}).populate('author', 'name', 'User').exec(function (err, post) {
    if (err) return;

    res.render('post/edit', {post: post});
  });
};

exports.editPost = function(req, res) {
  var title = req.body.title;
  var content = req.body.content;
  var tagsString = req.body.tags;
  var postId = req.params.id;
  var data = {
    title: title,
    content: content,
    author: req.user._id,
    tagString: tagsString,
    lastTouched: new Date
  };

  Post.findByIdAndUpdate(postId, data, function (err, post) {
    if (err) return;

    return res.redirect('/');
  });
};
