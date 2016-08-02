var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var mongoose = require('mongoose');
var GeoProblem = require('./models/GeoProblem');
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

app.listen(port, function () {
	console.log('server running on port', port);
})

mongoose.connect('mongodb://localhost:27017/saxon', function (err) {
	if (err) throw err;
});

// get requests - A/T/S 
app.get('/api/alg', algCtrl.index)
app.get('/api/geo', geoCtrl.index)
app.get('/api/alg2', alg2Ctrl.index)

// put requests - A/(T)
app.put('/api/alg', algCtrl.update)
app.put('/api/geo', geoCtrl.update)
app.put('/api/alg2', alg2Ctrl.update)

// delete requests - A/(T)
app.delete('/api/alg', algCtrl.destroy)
app.delete('/api/geo', geoCtrl.destroy)
app.delete('/api/alg2', alg2Ctrl.destroy)

// post requests - A/(T)
app.post('/api/alg', algCtrl.create)
app.post('/api/geo', geoCtrl.create)
app.post('/api/alg2', alg2Ctrl.create)