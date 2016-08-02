var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var alg2Schema = new Schema ({
	lessonNum: Number,
	problemNum: Number,
	lessonRef: Schema.Types.Mixed,
	assigned: Boolean
})

module.exports = mongoose.model('alg2Problem', alg2Schema)