var mongoose = require('mongoose');
var sprintf = require('sprintf-js').sprintf;
var Schema = mongoose.Schema;

var PostSchema = new Schema({
  author: Schema.Types.ObjectId,
  title: String,
  content: String,
  comments: [{ body: String, date: Date }],
  tags: [String],
  lastTouched: { type: Date, default: Date.now }
});

PostSchema.pre('save', function (next) {
  this.lastTouched = new Date;
  next();
});

PostSchema.virtual('posted_in').get(function () {
  return sprintf('%02d/%02d/%04d %02d:%02d', this.lastTouched.getDate(), this.lastTouched.getMonth(), this.lastTouched.getYear() + 1900, this.lastTouched.getHours(), this.lastTouched.getMinutes());
});

PostSchema.virtual('tagString').get(function () {
  return this.tags.join(', ');
}).set(function (tagString) {
  this.tags = tagString.split(',').map(function (tag) {
    return tag.trim();
  });
});

module.exports = mongoose.model('Post', PostSchema);
