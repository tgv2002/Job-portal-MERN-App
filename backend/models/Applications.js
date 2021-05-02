const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const ApplicationSchema = new Schema({
	title: {
		type: String,
        default: ""
    },
    jobType: {
        type: String,
		enum: ["Full time", "Part time", "Work from home"],
		default: "Full time"
    },
    applicant_id: {
        type: String,
        default: "-1"
    },
    applicant_name: {
        type: String,
        default: ""
    },
    recruiter_name: {
        type: String,
        default: ""
    },
    applicant_rating: {
        type: Number,
        default: 0
    },
    skills: {
        type: Array,
        default: []
    },
    education: {
        type: Array,
        default: []
    },
    date_of_applying: {
        type: Date,
        default: () => {return new Date();}
    },
	sop: {
		type: String,
        default: ""
    },
	joining_date: {
        type: Date,
        default: () => {return new Date();}
    },
    monthly_salary: {
        type: Number,
        default: 0
	},
	recruiter_id:{
        type: String,
		default: "-1"
    },
    listing_id: {
        type: String,
        default: "-1"
    },
    stage_of_application: {
        type: String,
        enum: ["Applied", "Shortlisted", "Accepted", "Rejected", "Deleted"],
        default: "Applied"
    },
    rated_job: {
		type: Boolean,
		default: false
	},
	rated_applicant: {
		type: Boolean,
		default: false
	}
});

module.exports = Application = mongoose.model("Applications", ApplicationSchema);