var mongoose = require('mongoose');
var sprintf = require('sprintf-js').sprintf;
var Schema = mongoose.Schema;

var formatDateFromAttr = function (attr) {
  return function () {
    return sprintf('%02d/%02d/%04d %02d:%02d', this[attr].getDate(), this[attr].getMonth(), this[attr].getYear() + 1900, this[attr].getHours(), this[attr].getMinutes());
  };
}
var autoUpdateDateField = function (field) {
  return function (next) {
    this[field] = new Date;
    next();
  };
}

var CommentSchema = new Schema({
  author: String,
  content: String,
  date: Date
});
CommentSchema.virtual('posted_in').get(formatDateFromAttr('date'));

var PostSchema = new Schema({
  author: Schema.Types.ObjectId,
  title: String,
  content: String,
  comments: [CommentSchema],
  tags: [String],
  lastTouched: { type: Date, default: Date.now }
});

PostSchema.pre('save', autoUpdateDateField('lastTouched'));
PostSchema.virtual('posted_in').get(formatDateFromAttr('lastTouched'));

PostSchema.virtual('tagString').get(function () {
  return this.tags.join(', ');
}).set(function (tagString) {
  this.tags = tagString.split(',').map(function (tag) {
    return tag.trim();
  });
});

module.exports = mongoose.model('Post', PostSchema);
