var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var problemSchema = require('./Problem');

var schoolSchema = new Schema ({
	name: String,
	problems: [problemSchema]
})

module.exports = mongoose.model('School', schoolSchema)