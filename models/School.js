var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var problemSchema = require('./Problem');

var schoolSchema = new Schema ({
	name: {type: String, required: true},
	city: {type: String, required: true},
	state: {type: String, required: true},
	algProblems: [problemSchema], 
	geoProblems: [problemSchema], 
	alg2Problems: [problemSchema], 
	algSkipped: Array,
	geoSkipped: Array,
	alg2Skipped: Array,
	adminKeys: Array
})

module.exports = mongoose.model('School', schoolSchema)