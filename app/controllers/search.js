var Post = require('../models/post');

exports.index = function(req, res){
  var title = req.query.title;
  var tag = req.query.tag;

  if (!title && !tag) {
    return res.render('search/index');
  }

  var filter = {};
  if (title) {
    filter.title = title;
  }
  if (tag) {
    filter.tags = {
      $all: [tag]
    };
  };

  Post.find(filter).populate('author', 'name', 'User').sort({lastTouched: -1}).exec(function (err, posts) {
    if (err) return;

    res.render('index', {posts: posts, isViewerLogged: !!req.user});
  });
};


