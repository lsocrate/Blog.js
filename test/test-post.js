var assert = require('chai').assert;
var path = require('path');
var request = require('supertest');
var app = require(path.join(__dirname,'..','app'));
var clearDb = require(path.join(__dirname,'helper')).clearDb;
var mongoose = require('mongoose');

suite('Post', function() {
  setup(function(){

  });

  suite('Post creation', function () {
    var authUser;

    suiteSetup(function (done) {
      clearDb();
      var UserModel = mongoose.model('User');
      var User = new UserModel({
        name : 'John Doe',
        email : 'email@domain.com',
        password : 'Password123*'
      });

      User.save(function (err, user) {
        authUser = request.agent(app);
        authUser
          .post('/signin')
          .field('email', 'email@domain.com')
          .field('password', 'Password123*')
          .end(function (err, res) {
            done();
          });
      })
    });

    test('Post creation loads for authenticated user', function (done) {
      authUser
        .get('/post/create')
        .expect('Content-Type', /html/)
        .expect(200, done);
    });
    test('Post creation does not load for authenticated user', function (done) {
      request(app)
        .get('/post/create')
        .expect('Content-Type', /plain/)
        .expect(/Redirecting to \/signin$/)
        .expect(302, done);
    });
    test('Create valid post', function (done) {
      authUser
        .post('/post/create')
        .field('title', 'Post title')
        .field('content', 'Post content')
        .field('tags', "Post tags, and other tag")
        .expect('Content-Type', /plain/)
        .expect(/Redirecting to \/$/)
        .expect(302, done);
    });
    test('Create invalid post, missing title', function (done) {
      authUser
        .post('/post/create')
        .field('title', '')
        .field('content', 'Post content')
        .field('tags', "Post tags, and other tag")
        .expect('Content-Type', /html/)
        .expect(/Fill the Post title/)
        .expect(200, done);
    });
    test('Create invalid post, missing content', function (done) {
      authUser
        .post('/post/create')
        .field('title', 'Post title')
        .field('content', '')
        .field('tags', "Post tags, and other tag")
        .expect('Content-Type', /html/)
        .expect(/Fill the Post content/)
        .expect(200, done);
    });
  });

  suite('Post edit', function (){
    var authUser;
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
        authUser = request.agent(app);
        authUser
          .post('/signin')
          .field('email', 'email@domain.com')
          .field('password', 'Password123*')
          .end(function (err, res) {
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
    });

    test('Post edit loads for authenticated user', function (done) {
      authUser
        .get('/post/' + postId + '/edit')
        .expect('Content-Type', /html/)
        .expect(200, done);
    });
    test('Post edit does not load for unauthenticated user', function (done) {
      request(app)
        .get('/post/' + postId + '/edit')
        .expect('Content-Type', /plain/)
        .expect(/Redirecting to \/signin$/)
        .expect(302, done);
    });
    test('Edit post with valid data', function (done) {
      authUser
        .post('/post/' + postId + '/edit')
        .field('title', 'Post title')
        .field('content', 'Post content')
        .field('tags', "Post tags, and other tag")
        .expect('Content-Type', /plain/)
        .expect(302, done);
    });
    test('Edit post with invalid data, missing title', function (done) {
      authUser
        .post('/post/' + postId + '/edit')
        .field('title', '')
        .field('content', 'Post content')
        .field('tags', "Post tags, and other tag")
        .expect('Content-Type', /html/)
        .expect(/Fill the Post title/)
        .expect(200, done);
    });
    test('Edit post with invalid data, missing content', function (done) {
      authUser
        .post('/post/' + postId + '/edit')
        .field('title', 'Post title')
        .field('content', '')
        .field('tags', "Post tags, and other tag")
        .expect('Content-Type', /html/)
        .expect(/Fill the Post content/)
        .expect(200, done);
    });
  });

  suite('Read post', function (){
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

    test('Read post', function (done) {
      request(app)
        .get('/post/' + postId)
        .expect('Content-Type', /html/)
        .expect(/Post title/)
        .expect(200, done);
    });
  });
})
