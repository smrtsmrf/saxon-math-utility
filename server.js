var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var mongoose = require('mongoose');
var session = require('express-session');
var config = require('./config.json');
var algCtrl = require('./controllers/algCtrl');
var geoCtrl = require('./controllers/geoCtrl');
var alg2Ctrl = require('./controllers/alg2Ctrl');

var port = 3000;
var corsOptions = {
	origin: 'http://localhost:' + port
};

var app = express();
app.use(bodyParser.json());
app.use(cors(corsOptions));
app.use(express.static(__dirname + '/public/'));
// app.use(session({secret: config.sessionSecret}))
app.use(session({
  secret: config.sessionSecret,
  saveUninitialized: true,
  resave: true
}));

app.listen(port, function () {
	console.log('server running on port', port);
})

mongoose.connect('mongodb://localhost:27017/saxon', function (err) {
	if (err) throw err;
});

// mongoose.set('debug', true)

// inside endpoint do req.session.skipped = req.body
// store session data in database? how?
// 


 // need endpoint that returns skipped lessons
 // findById

// get requests - A/T/S 
app.get('/api/alg', algCtrl.index)
app.get('/api/geo', geoCtrl.index)
app.get('/api/alg2', alg2Ctrl.index)

// put requests - A/(T)
app.put('/api/alg', algCtrl.reset, algCtrl.update, algCtrl.index)
app.put('/api/geo', geoCtrl.reset, geoCtrl.update, geoCtrl.index)
app.put('/api/alg2', alg2Ctrl.reset, alg2Ctrl.update, alg2Ctrl.index)
// app.put('/api/alg', algCtrl.reset)
// app.put('/api/geo', geoCtrl.reset)
// app.put('/api/alg2', alg2Ctrl.reset)

// delete requests - A/(T)
app.delete('/api/alg', algCtrl.destroy)
app.delete('/api/geo', geoCtrl.destroy)
app.delete('/api/alg2', alg2Ctrl.destroy)

// post requests - A/(T)
app.post('/api/alg', algCtrl.create)
app.post('/api/geo', geoCtrl.create)
app.post('/api/alg2', alg2Ctrl.create)