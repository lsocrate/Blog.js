var express = require('express');
var http = require('http');
var path = require('path');
var app = express();
var passport = require('passport');
var mongoose = require('mongoose');
var auth = require('./middlewares/authorization');
var controllerIndex = require('./controllers/index');
var controllerUser = require('./controllers/user');
var controllerPost = require('./controllers/post');

mongoose.connect('mongodb://localhost/blog');

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');

app.set('layout', 'layout')
app.enable('view cache')
app.engine('html', require('hogan-express'))

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

require('./config/passport')(passport);


app.get('/', controllerIndex.index);
app.get('/signin', controllerUser.signin);
app.post('/signin', passport.authenticate('local', { successRedirect: '/', failureRedirect: '/signin'}));
app.get('/signup', controllerUser.getSignup);
app.post('/signup', controllerUser.postSignup);
app.get('/post/create', auth.requiresLogin, controllerPost.createPostPage);
app.post('/post/create', auth.requiresLogin, controllerPost.createPost);
app.get('/post/:id/edit', auth.requiresLogin, controllerPost.edit);
app.post('/post/:id/edit', auth.requiresLogin, controllerPost.editPost);
app.get('/post/:id', controllerPost.read);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
