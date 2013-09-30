var mongoose = require('mongoose');
var sprintf = require('sprintf-js').sprintf;
var Schema = mongoose.Schema;

var PostSchema = new Schema({
  author: Schema.Types.ObjectId,
  title: String,
  content: String,
  comments: [{ body: String, date: Date }],
  tags: [String],
  created: { type: Date, default: Date.now }
});
PostSchema.virtual('posted_in').get(function () {
  return sprintf('%02d/%02d/%04d %02d:%02d', this.created.getDate(), this.created.getMonth(), this.created.getYear() + 1900, this.created.getHours(), this.created.getMinutes());
});

module.exports = mongoose.model('Post', PostSchema);
