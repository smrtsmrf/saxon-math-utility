var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var problemSchema = require('./Problem');

var schoolSchema = new Schema ({
	name: {type: String, required: true},
	city: {type: String, required: true},
	state: {type: String, required: true},
	problems: [problemSchema]
})

module.exports = mongoose.model('School', schoolSchema)