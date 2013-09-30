var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PostSchema = new Schema({
  author: Schema.Types.ObjectId,
  title: String,
  content: String,
  comments: [{ body: String, date: Date }],
  tags: [String],
  created: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Post', PostSchema);
