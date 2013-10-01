var assert = require('chai').assert;
var path = require('path');
var request = require('supertest');
var app = require(path.join(__dirname,'..','app'));
var clearDb = require(path.join(__dirname,'helper')).clearDb;
var mongoose = require('mongoose');

suite('Comments', function() {
  setup(function(){

  });

  suite('Comment creation', function (){
    var postId;

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

    test('Create valid comment', function (done) {
      request(app)
        .post('/post/' + postId + '/comment')
        .field('author', 'Comment author')
        .field('content', 'Comment content')
        .expect('Content-Type', /plain/)
        .expect(302, done);
    });
    test('Create invalid comment, missing author', function (done) {
      request(app)
        .post('/post/' + postId + '/comment')
        .field('author', '')
        .field('content', 'Comment content')
        .expect('Content-Type', /plain/)
        .expect(302, done);
    });
    test('Create invalid comment, missing content', function (done) {
      request(app)
        .post('/post/' + postId + '/comment')
        .field('author', 'Comment author')
        .field('content', '')
        .expect('Content-Type', /plain/)
        .expect(302, done);
    });
  });
})
