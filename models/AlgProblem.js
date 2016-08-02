var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var algSchema = new Schema ({
	lessonNum: Number,
	problemNum: Number,
	lessonRef: Schema.Types.Mixed,
	assigned: Boolean
})

module.exports = mongoose.model('algProblem', algSchema)