var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var geoSchema = new Schema ({
	lessonNum: Number,
	problemNum: Number,
	lessonRef: Schema.Types.Mixed,
	assigned: Boolean
})

module.exports = mongoose.model('geoProblem', geoSchema)