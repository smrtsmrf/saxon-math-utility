var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema ({
	type: {
		type: String,
		lowercase: true,
		required: true,
		enum: [
			'admin',
			'teacher',
			'student'
			]
	},
	username: {
		type: Schema.Types.Mixed,
		unique: true,
		required: true
	},
	password: {
		type: Schema.Types.Mixed,
		required: true
	},
	school_id: {
		type: Schema.Types.ObjectId, 
		ref: 'School',
		required: true
	}
})

module.exports = mongoose.model('User', userSchema)