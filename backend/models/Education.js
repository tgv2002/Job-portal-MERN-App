const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const EducationSchema = new Schema({
	institute_name: {
		type: String,
		default: ""
	},
	start_year: {
		type: Number,
		default: 0,
	},
	end_year: {
		type: Number,
        default: 0
    },
    applicant_id: {
        type: String,
        default: "-1"
    }
});

module.exports = Education = mongoose.model("Education", EducationSchema);
