var Post = require('../models/post');

exports.create = function(req, res) {
  var author = req.body.author;
  var content = req.body.content;
  var postId = req.params.id;

  if (!author || !content) {
    return res.redirect('/post/' + postId);
  }

  Post.findOne({_id: req.params.id}).exec(function (err, post) {
    if (err) return;

    var comment = {
      content: content,
      author: author,
      date: new Date
    };
    post.comments.push(comment);
    post.save(function (err, post) {
      if (err) return;

      return res.redirect('/post/' + postId);
    });
  });
};
