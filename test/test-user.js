var assert = require('chai').assert;
var path = require('path');
var request = require('supertest');
var app = require(path.join(__dirname,'..','app'));
var clearDb = require(path.join(__dirname,'helper')).clearDb;
var mongoose = require('mongoose');

suite('Index', function() {
  setup(function(){

  });

  suite('Index', function () {
    test('List posts', function (done) {
      request(app)
        .get('/')
        .expect('Content-Type', /html/)
        .expect(200, done);
    })
  });

  suite('Signup', function () {
    test('Signup page loads', function (done) {
      request(app)
        .get('/signup')
        .expect('Content-Type', /html/)
        .expect(200, done);
    });

    suite('Signup creation', function () {
      setup(function (){
        clearDb();
      });

      test('Valid signup', function (done) {
        request(app)
          .post('/signup')
          .field('name', 'John Doe')
          .field('email', 'email@domain.com')
          .field('password', 'Password123*')
          .expect('Content-Type', /plain/)
          .expect(302, done);
      });
      test('Invalid Signup, missing name', function (done) {
        request(app)
          .post('/signup')
          .field('name', '')
          .field('email', 'email@domain.com')
          .field('password', 'Password123*')
          .expect('Content-Type', /html/)
          .expect(/fill your name/)
          .expect(200, done);
      });
      test('Invalid Signup, missing email', function (done) {
        request(app)
          .post('/signup')
          .field('name', 'John Doe')
          .field('email', '')
          .field('password', 'Password123*')
          .expect('Content-Type', /html/)
          .expect(/fill your email/)
          .expect(200, done);
      });
      test('Invalid Signup, missing password', function (done) {
        request(app)
          .post('/signup')
          .field('name', 'John Doe')
          .field('email', 'email@domain.com')
          .field('password', '')
          .expect('Content-Type', /html/)
          .expect(/fill your password/)
          .expect(200, done);
      });
    });
  });

  suite('Signin', function () {
    suiteSetup(function (done){
      clearDb();
      var UserModel = mongoose.model('User');
      var User = new UserModel({
        name : 'John Doe',
        email : 'email@domain.com',
        password : 'Password123*'
      });
      User.save(function (err, user) {
        done();
      })
    });

    test('Valid signin', function (done) {
      request(app)
        .post('/signin')
        .field('email', 'email@domain.com')
        .field('password', 'Password123*')
        .expect('Content-Type', /plain/)
        .expect(/Redirecting to \//)
        .expect(302, done);
    });
    test('Invalid signin', function (done) {
      request(app)
        .post('/signin')
        .field('email', 'errado@domain.com')
        .field('password', 'errado')
        .expect('Content-Type', /plain/)
        .expect(/Redirecting to \/signin/)
        .expect(302, done);
    });
  });
})
