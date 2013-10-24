var express = require('express');
var http = require('http');
var path = require('path');
var app = express();
var passport = require('passport');
var mongoose = require('mongoose');
var env = process.env.NODE_ENV || 'development';
var config = require(path.join(__dirname,'config','config'))[env];
var auth = require(path.join(__dirname,'app','middlewares','authorization'));
var defaultInfo = require(path.join(__dirname,'app','middlewares','defaultInfo'));
var controllerIndex = require(path.join(__dirname, 'app','controllers','index'));
var controllerUser = require(path.join(__dirname, 'app','controllers','user'));
var controllerPost = require(path.join(__dirname, 'app','controllers','post'));
var controllerComment = require(path.join(__dirname, 'app','controllers','comment'));
var controllerSearch = require(path.join(__dirname, 'app','controllers','search'));

mongoose.connect(config.mongoDB);

// all environments
app.set('port', config.serverPort);
app.set('views', path.join(__dirname, 'app', 'views'));
app.set('view engine', 'html');
app.set('layout', 'layout');
app.enable('view cache');
app.engine('html', require('hogan-express'));

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser(config.cookieSecret));
app.use(express.session());
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' === app.get('env')) {
  app.use(express.errorHandler());
}

require(path.join(__dirname, 'config','passport'))(passport);


app.get('/', defaultInfo, controllerIndex.index);
app.get('/signin', defaultInfo, controllerUser.signin);
app.post('/signin', defaultInfo, passport.authenticate('local', { successRedirect: '/', failureRedirect: '/signin'}));
app.get('/signup', defaultInfo, controllerUser.getSignup);
app.post('/signup', defaultInfo, controllerUser.postSignup);
app.get('/changepassword', [auth.requiresLogin, defaultInfo], controllerUser.getChangePassword);
app.post('/changepassword', [auth.requiresLogin, defaultInfo], controllerUser.postChangePassword);
app.get('/post/create', [auth.requiresLogin, defaultInfo], controllerPost.createPostPage);
app.post('/post/create', [auth.requiresLogin, defaultInfo], controllerPost.createPost);
app.get('/post/:id/edit', [auth.requiresLogin, defaultInfo], controllerPost.edit);
app.post('/post/:id/edit', [auth.requiresLogin, defaultInfo], controllerPost.editPost);
app.get('/post/:id/delete', [auth.requiresLogin, defaultInfo], controllerPost.delete);
app.get('/comment/:id/delete', [auth.requiresLogin, defaultInfo], controllerComment.delete);
app.get('/post/:id', defaultInfo, controllerPost.read);
app.post('/post/:id/comment', defaultInfo, controllerComment.create);
app.get('/tag/:tag/posts', defaultInfo, controllerIndex.byTag);
app.get('/search', defaultInfo, controllerSearch.index);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


// EXPORT FOR TESTS
exports = module.exports = app;
