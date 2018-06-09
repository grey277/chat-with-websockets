module.exports = function (app, passport, io) {
  var Message = require('../app/models/message');

  app.get('/', function (req, res) {
    res.render('index.ejs'); // load the index.ejs file
  });

  app.get('/login', function (req, res) {

    res.render('login.ejs', {
      message: req.flash('loginMessage')
    });
  });

  app.get('/signup', function (req, res) {

    res.render('signup.ejs', {
      message: req.flash('signupMessage')
    });
  });

  app.get('/chat', isLoggedIn, function (req, res) {
    res.render('chat.ejs', {user: req.user});
  });

  app.get('/admin-panel', isSuperUser, function (req, res) {
    Message
      .find()
      .exec(function (err, messages) {
        if (err) 
          throw err
        res.render('admin-panel.ejs', {
          user: req.user,
          messages: messages
        });
      });

  });

  app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
  });

  // process the signup form
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/chat', // redirect to the secure profile section
    failureRedirect: '/signup', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }));

  // process the login form
  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/chat', // redirect to the secure profile section
    failureRedirect: '/login', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }));

  app.get('/delete/:id', function (req, res) {
    console.log("ID: " + req.params.id)
    Message
      .remove({"_id": req.params.id})
      .exec(function (err) {
        if (err) 
          throw err
        res.redirect('/admin-panel');
      });
  });

  var history = [];
  var clients = [];

  function htmlEntities(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  var colors = [
    'red',
    'green',
    'blue',
    'magenta',
    'purple',
    'plum',
    'orange'
  ];

  colors.sort(function (a, b) {
    return Math.random() > 0.5;
  });

  io
    .sockets
    .on('connection', function (socket) {

      console.log("User connected!");

      socket.on('send_history', function () {
        Message
          .find()
          .exec(function (err, messages) {
            if (err) 
              throw err;
            messages
              .forEach(function (message) {
                socket.emit(message.message_type, message.nickname, message.message);
              });

          });
      });

      socket.on('nickname', function (msg) {
        socket.nickname = msg;
        console.log("Welcome: " + socket.nickname);
      });

      socket.on('text_message', function (msg) {
        socket
          .broadcast
          .emit('text_message', socket.nickname, msg);
        console.log("Broadcast: " + msg);
        var message = new Message();
        message.nickname = socket.nickname
        message.message_type = 'text_message';
        message.message = msg;
        message.save(function (err) {
          if (err) 
            throw err;
          }
        );
      });

      socket.on('image_message', function (msg) {
        socket
          .broadcast
          .emit('image_message', socket.nickname, msg);
        console.log("Broadcast: " + msg);
        var message = new Message();
        message.nickname = socket.nickname
        message.message_type = 'image_message';
        message.message = msg;
        message.save(function (err) {
          if (err) 
            throw err;
          }
        );
      });
    });

};

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) 
    return next();
  
  res.redirect('/');
}

function isSuperUser(req, res, next) {
  return next();

}