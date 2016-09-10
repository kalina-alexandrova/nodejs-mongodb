var express = require('express');
var app = express();
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var path = require('path');

var port = process.env.PORT || 8090; // set our port
var router = express.Router();
var db = require('./models/db'),
    user = require('./models/userModel');

var routes = require('./routes/index'),
    users = require('./routes/users');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());


router.get('/', function(req, res) {
    res.json({
        message: 'hooray! welcome to our api!'
    });
});

//app.use('/api', router);
app.use('/', routes);
app.use('/users', users);

app.listen(port);
console.log('Magic happens on port ' + port);

module.exports = app;

//for testing purposes

/*var MongoClient = require('mongodb').MongoClient;
// Connection URL
var url = 'mongodb://localhost:27017/users';

// Use connect method to connect to the server
MongoClient.connect(url, function(err, db) {
  console.log("Connected successfully to server");
  //db.close();
});*/