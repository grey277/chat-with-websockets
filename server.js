var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var bodyParser = require('body-parser');
var flash = require('connect-flash');
var server = require('http').Server(app);
var io = require('socket.io')(server);

var cookieParser = require('cookie-parser');
var session = require('express-session');

var configDB = require('./config/database.js');

mongoose.connect(configDB.url);
require('./config/passport')(passport);

app.use(cookieParser());
app.use(bodyParser());

app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/app/js'));
app.use(express.static(__dirname + '/app/css'));
app.use(session({secret: '$"q-h^Ph/<:5f5L+>j+W'})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash());

require('./app/routes.js')(app, passport, io);

//app.listen(port); start webserver

var static = require('node-static');

var webSocketsServerPort = 9000;

server.listen(port, function () {
  console.log("Started lisining on port " + port);
});
