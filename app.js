var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');
var passport = require('passport');
var mongoose = require('mongoose');

var socketCtrl = require('./controllers/socketController.js');

var User = require('./models/user.js');
var Room = require('./models/room.js');
var Message = require('./models/message.js');

var app = express();
app.io = require('socket.io')();
app.io.on('connection', socketCtrl);

// passport
passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

app.use(passport.initialize());

module.exports = app; // export the app instance before require the routes.

mongoose.connect('mongodb://localhost:27017/ViaWestApi');
var dbConnection = mongoose.connection;
dbConnection.on('error', console.error);
dbConnection.once('open', function() {

    //// Seed DB with users
    //var user = new User();
    // user.password = 'password';
    // user.username = 'userone';
    //user.role = 'admin';
    //
    // user.save(function(err){
    // // handle errors
    // console.error(err);
    // });
    //
    //var user = new User();
    //user.password = 'password';
    //user.username = 'usertwo';
    //user.role = 'member';
    //
    //user.save(function(err){
    //    // handle errors
    //    console.error(err);
    //});

    // seed rooms

    //var room = new Room();
    //room.name = 'Sports';
    //room.createdBy = 'userone';
    //room.save(function(err){console.log(err)});
    //
    //var room = new Room();
    //room.name = 'Technology';
    //room.createdBy = 'userone';
    //room.save(function(err){console.log(err)});
    //
    //var room = new Room();
    //room.name = 'Social';
    //room.createdBy = 'userone';
    //room.save(function(err){console.log(err)});
    //
    //var room = new Room();
    //room.name = 'News';
    //room.createdBy = 'userone';
    //room.save(function(err){console.log(err)});
    //
    //var message = new Message();
    //message.text = 'Welcome to the Sports room, chat like you own it!';
    //message.room = 'Sports';
    //message.user = 'userone';
    //message.createdOn = new Date();
    //message.save(function(err){console.log(err)});
    //
    //var message = new Message();
    //message.text = 'Welcome to the Technology room, chat like you own it!';
    //message.room = 'Technology';
    //message.user = 'userone';
    //message.createdOn = new Date();
    //message.save(function(err){console.log(err)});
    //
    //var message = new Message();
    //message.text = 'Welcome to the Social room, chat like you own it!';
    //message.room = 'Social';
    //message.user = 'userone';
    //message.createdOn = new Date();
    //message.save(function(err){console.log(err)});
    //
    //var message = new Message();
    //message.text = 'Welcome to the News room, chat like you own it!';
    //message.room = 'News';
    //message.user = 'userone';
    //message.createdOn = new Date();
    //message.save(function(err){console.log(err)});

});



// Routes
var routes = require('./routes/index')({app: app});


app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Use Routes
app.use('/', routes);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({message: err.message, error: err});
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({message: err.message});
});


