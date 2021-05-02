const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const SkillSchema = new Schema({
	skill: {
		type: String,
		default: ""
	},
    applicant_id: {
        type: String,
        default: "-1"
    }
});

module.exports = Skill = mongoose.model("Skill", SkillSchema);
