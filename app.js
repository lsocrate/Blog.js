var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var post = require('./routes/post');
var http = require('http');
var path = require('path');
var app = express();
var passport = require('passport');
var mongoose = require('mongoose');
var auth = require('./middlewares/authorization');

mongoose.connect('mongodb://localhost/blog');

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'hjs');
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


app.get('/', routes.index);
app.get('/signin', user.signin);
app.post('/signin', passport.authenticate('local', { successRedirect: '/', failureRedirect: '/signin'}));
app.get('/signup', user.getSignup);
app.post('/signup', user.postSignup);
app.get('/post/create', auth.requiresLogin, post.createPostPage);
app.post('/post/create', auth.requiresLogin, post.createPost);
app.get('/post/:id', post.read);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
