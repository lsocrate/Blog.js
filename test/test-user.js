var assert = require('chai').assert;
var path = require('path');
var request = require('supertest');
var app = require(path.join(__dirname,'..','app'));
var clearDb = require(path.join(__dirname,'helper')).clearDb;

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

    suite('Signin', function () {
      setup(function (){
        clearDb();
        request(app)
          .post('/signup')
          .field('name', 'John Doe')
          .field('email', 'email@domain.com')
          .field('password', 'Password123*');
      });

      test('Valid signin', function (done) {
        request(app)
          .post('/signin')
          .field('email', 'email@domain.com')
          .field('password', 'Password123*')
          .expect('Content-Type', /plain/)
          .expect(302, done);
      });
    });
  });
})
