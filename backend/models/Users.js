const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
	name: {
		type: String,
		default: ""
	},
	email: {
		type: String
	},
	got_job: {
		type: Boolean,
		default: false
	},
	password: {
		type: String
    },
    type: {
        type: String,
		enum: ["Applicant", "Recruiter"],
		default: "Applicant"
	},
	number_rated: {
		type: Number,
		default: 0
	},
	sum_rated: {
		type: Number,
		default: 0
	},
	contact: {
		type: String,
		default: ""
	},
	bio: {
		type: String,
		default: ""
	},
	application_count: {
		type: Number,
		default: 0
	},
	curr_job_id: {
		type: String,
		default: "-1"
	}
});

module.exports = User = mongoose.model("Users", UserSchema);
