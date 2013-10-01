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
    })
  });
})
