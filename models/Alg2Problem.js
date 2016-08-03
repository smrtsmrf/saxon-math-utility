var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// require problem model;

var alg2Schema = new Schema ({
	lessonNum: Number,
	problemNum: Number,
	lessonRef: Schema.Types.Mixed,
	assigned: Boolean
	// problems: [problemModel]
	// see day 27 models
	// schools will be model, users will be model, problems, just export (like bird)
})

module.exports = mongoose.model('alg2Problem', alg2Schema)