const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const users = require('./routes/users');

// Express App initialization
const app = express();

// Port Setting
const port = process.env.PORT || 8080;

// Cors Middleware
app.use(cors());

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(bodyParser.json());

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

// Routing
app.use('/users', users);

app.get('/', function(req, res){
    res.send('Invalid Endpoint');
});

// Entry Point
app.get('*', function(req, res){
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Listening
app.listen(port, function() {
    console.log('Server started on port ' + port);
});
