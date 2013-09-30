var Post = require('../models/post');

exports.createPostPage = function(req, res) {
  res.render('post/create');
};

exports.createPost = function(req, res) {
  var title = req.body.title;
  var content = req.body.content;
  var tagsString = req.body.tags;
  var tags = tagsString.split(',').map(function(tag){return tag.trim();});

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
