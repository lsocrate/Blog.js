var assert = require('chai').assert;
var path = require('path');
var request = require('supertest');
var app = require(path.join(__dirname,'..','app'));
var clearDb = require(path.join(__dirname,'helper')).clearDb;
var mongoose = require('mongoose');

suite('Search', function() {
  setup(function(){

  });

  suite('Read posts by tag', function (){
    suiteSetup(function (done) {
      clearDb();
      var UserModel = mongoose.model('User');
      var User = new UserModel({
        name : 'John Doe',
        email : 'email@domain.com',
        password : 'Password123*'
      });

      User.save(function (err, user) {
        var PostModel = mongoose.model('Post');
        var Post = new PostModel({
          author: user._id,
          title: 'Post title',
          content: 'Post content',
          tags: ['tag1', 'tag2', 'tag3']
        });
        Post.save(function (err, post) {
          postId = post._id;
          done();
        });
      });
    });

    test('Read posts by tag', function (done) {
      request(app)
        .get('/tag/tag1/posts')
        .expect('Content-Type', /html/)
        .expect(/Post title/)
        .expect(200, done);
    });
    test('Read posts by nonexistant tag', function (done) {
      request(app)
        .get('/tag/tag4/posts')
        .expect('Content-Type', /html/)
        .expect(/No posts found!/)
        .expect(200, done);
    });
  });

  suite('Search by title', function () {
    suiteSetup(function (done) {
      clearDb();
      var UserModel = mongoose.model('User');
      var User = new UserModel({
        name : 'John Doe',
        email : 'email@domain.com',
        password : 'Password123*'
      });

      User.save(function (err, user) {
        var PostModel = mongoose.model('Post');
        var Post = new PostModel({
          author: user._id,
          title: 'Baleias azuis',
          content: 'Post content',
          tags: ['tag1', 'tag2', 'tag3']
        });
        Post.save(function (err, post) {
          postId = post._id;
          done();
        });
      });
    });

    test('Search for title', function (done) {
      request(app)
        .get('/search?title=Baleias azuis&tag=')
        .expect('Content-Type', /html/)
        .expect(/Baleias azuis/)
        .expect(200, done);
    });
    test('Search for non existant title', function (done) {
      request(app)
        .get('/search?title=Baleias roxas&tag=')
        .expect('Content-Type', /html/)
        .expect(/No posts found!/)
        .expect(200, done);
    });
  });
})
