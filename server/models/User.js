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
	email: {
		type: String
	},
	school_id: {
		type: Schema.Types.ObjectId, 
		ref: 'School',
		required: true
	},
	school_name: {
		type: String,
		required: true
	},
	school_city: {
		type: String,
		required: true
	},
	school_state: {
		type: String,
		required: true
	},
	verificationCode: {
		type: String,
		// enum: [
		// 	'1234'
		// 	],
		match: /1234/,
		required: true
	}
})

module.exports = mongoose.model('User', userSchema)