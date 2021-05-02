const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const JobListingSchema = new Schema({
	title: {
		type: String,
		default: ""
	},
	status: {
		type: String,
		enum: ["Active", "Expired"],
		default: "Active"
	},
	recruiter_name: {
		type: String,
		default: ""
	},
	recruiter_email: {
        type: String,
		default: ""
	},
	recruiter_rating:{
		type: Number,
		default: 0
	},
	recruiter_id: {
		type: String,
		default: "-1"
	},
	open_applications: {
		type: Number,
		default: 0
	},
    max_applications: {
        type: Number,
		default: 0
	},
	accepted_applications: {
		type: Number,
		default: 0
	},
	max_positions: {
		type: Number,
		default: 0
	},
	date_of_posting: {
		type: Date,
		default: () => {return new Date();}
	},
	deadline: {
		type: Date,
		default: () => {return new Date();}
	},
	skill_set: {
		type: String,
		default: ""
	},
	job_type: {
		type: String,
		enum: ["Full time", "Part time", "Work from home"],
		default: "Full time"
	},
	duration: {
		type: Number,
		default: 0
	},
	monthly_salary: {
		type: Number,
		default: 0
	},
	number_rated: {
		type: Number,
		default: 0
	},
	sum_rated: {
		type: Number,
		default: 0
	}
});

module.exports = JobListing = mongoose.model("JobListings", JobListingSchema);