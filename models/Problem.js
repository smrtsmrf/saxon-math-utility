var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var problemSchema = new Schema({
	subject: String,
	lessonNum: Number,
	problemNum: Number,
	lessonRef: Schema.Types.Mixed,
	assigned: Boolean
});

module.exports = problemSchema;