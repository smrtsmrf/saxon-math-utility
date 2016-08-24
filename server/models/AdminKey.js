var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var adminKeySchema = new Schema({
	key: Schema.Types.Mixed,
	subject: String,
	shouldDo: Array,
	shouldSkip: Array,
	createdAt: {
		type: Date,
		default: Date.now,
	}, 
});

module.exports = adminKeySchema;