var express = require("express");
var router = express.Router();
const bcrypt = require("bcryptjs");
const key = require("../config/key");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const isEmpty = require("is-empty");
// Load Application model
const Application = require("../models/Applications");
const JobListing = require("../models/JobListings");
const User = require("../models/Users");
const Skill = require("../models/Skills");
const Education = require("../models/Education");
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');


// GET request 
// Getting all the applications
router.get("/", (req, res) => {
		Application.find(function(err, applications) {
				if (err) {
				console.log(err);
				} else {
				res.json(applications);
                }
        })
});

// Getting all applications by job id
router.get("/job/:id", (req, res) => {
		Application.find({listing_id: req.params.id})
		.then(appls => res.status(200).json(appls))
		.catch((err) => {
				res.status(400).send("Applications not found");
				});
		});

// Getting all applications by user id
router.get("/user/:id", async(req, res) => {

	let appls = await Application.find({applicant_id: req.params.id});

	if(appls){
		for(let i=0;i<(appls).length;i++){
			if(appls[i].recruiter_id !== "-1"){
				let user = await User.findById(appls[i].recruiter_id);
				appls[i].recruiter_name = user.name;
				await appls[i].save();
			}
		}
	}

	res.status(200).json(appls);

	/*Application.find({applicant_id: req.params.id})
		.then((appls) => {
			if(appls){
				for(let i=0;i<appls.length;i++){
					appls[i].recruiter_name
				}
			}
			res.status(200).json(appls);
		})
		.catch((err) => {
				res.status(400).send("Applications not found");
				});*/
});

router.get("/details/:id", async (req, res) => {

		/*Application.find({listing_id: req.params.id})
		  .then((app_list) => {
		  var appl_details = [];
		  console.log("GOT HERE");

		  if(app_list){
		  console.log("GOT HERE 0");
		//console.log(app_list);

		//console.log(app_list.length);
		let dict = [];

		for(let i=0;i<app_list.length;i++){

		//console.log(app_list[0]);
		console.log("GOT HERE 1");

		User.findById(app_list[i].applicant_id)
		.then((userVal) => {
		let dict = {application: {}, };
		dict.application = app_list[i];
		dict.user = userVal;
		console.log("GOT HERE 2");

		Education.find({applicant_id: userVal._id})
		.then((educ_list) => {
		dict.education_details = educ_list;
		console.log("GOT HERE 3");

		Skill.find({applicant_id: userVal._id})
		.then((skill_list) => {
		dict.skills = skill_list;
		console.log("GOT HERE 4");
		appl_details.push(dict);


		if(i === app_list.length - 1){
		res.status(200).json(appl_details);
		console.log(appl_details);
		}
		})
		.catch(err => res.status(400).send("Error in getting applicant skills"));
		})
		.catch(err => res.status(400).send("Error in getting applicant education"));
		})
		.catch(err => res.status(400).send("Invalid applicant encountered"));
		}
		}
		})
		.catch(err => res.status(400).send("Error in finding applications"));*/

	var appl_details = [];
	let app_list = await Application.find({listing_id: req.params.id});
	if(app_list){
		for(let i=0;i<app_list.length;i++){
			var dictOry = {};
			if(app_list[i]) dictOry.application = app_list[i];
			let userVal = await User.findById(app_list[i].applicant_id);
			if(userVal) dictOry.user = userVal;
			let skill_list = await Skill.find({applicant_id: userVal._id});
			if(skill_list) dictOry.skills = skill_list;
			let educ_list = await Education.find({applicant_id: userVal._id});
			if(educ_list) dictOry.education_details = educ_list;
			appl_details.push(dictOry);
		}
	}
	return res.status(200).json(appl_details);
});

// Adding new application
router.post("/add/", async(req, res) => {

		let user = await User.findById(req.body.applicant_id);
		if(!(user.got_job || user.application_count >= 10)){
		let job = await JobListing.findById(req.body.listing_id);

		if(job.open_applications < job.max_applications){
		var applicant_rat; var applicant_nam;
		var skillsss; var educationn;var jobType;
		var titl; var sal; var recruiter_name;
		let userVal = await User.findById(req.body.applicant_id);
		applicant_nam = userVal.name;
		applicant_rat = (userVal.number_rated === 0) ? 0 : (userVal.sum_rated / userVal.number_rated);
		let userVal2 = await User.findById(req.body.recruiter_id);
		recruiter_name = userVal2.name;
		skillsss = await Skill.find({applicant_id: req.body.applicant_id});
		educationn = await Education.find({applicant_id: req.body.applicant_id});
		let jobby = await JobListing.findById(req.body.listing_id);
		titl = jobby.title;
		sal = jobby.monthly_salary;
		jobType = jobby.job_type;
		job.open_applications++;
		await job.save();
		user.application_count++;
        await user.save();
        
		const appl = new Application({
        title: titl,
        jobType: jobType,
        applicant_id: req.body.applicant_id,
        applicant_name: applicant_nam,
        recruiter_name: recruiter_name,
        applicant_rating: applicant_rat,
        skills: skillsss,
        education: educationn,
        date_of_applying: req.body.date_of_applying,
        sop: req.body.sop,
        monthly_salary: sal,
        recruiter_id: req.body.recruiter_id,
        listing_id: req.body.listing_id,
        stage_of_application: "Applied",
        joining_date: new Date()
        });

		//console.log("APPLICATION GONNA BE ADDED");
        await appl.save();
        res.status(200).send("Application added successfully");
} else {
	res.status(400).send('This listing is not accepting any more applications');
}

} else if(user.application_count >= 10) {
		//console.log("Application count is " + user.application_count);
		res.status(400).send('Applicant cannot have more than 10 open applications at a given time');
} else {
	res.status(400).send('Applicant cannot apply if his application for another job is accepted');
}

/*User.findById(req.body.applicant_id)
  .then((user) => {
  if(!(user.got_job || user.application_count >= 10))
  {
  JobListing.findById(req.body.listing_id)
  .then((job) => {
  if(job.open_applications < job.max_applications)
  {
  var applicant_rat; var applicant_nam;
  var skillsss; var educationn;var jobType;
  var titl; var sal; var recruiter_name;

  User.findById(req.body.applicant_id)
  .then((user) => {
  if(user){
  applicant_nam = user.name;
  applicant_rat = (user.number_rated === 0) ? 0 : (user.sum_rated / user.number_rated);
  }

  User.findById(req.body.recruiter_id)
  .then((user) => {
  if(user)
  recruiter_name = user.name;

  Skill.find({applicant_id: req.body.applicant_id})
  .then((skillss) => {
  skillsss = skillss;

  Education.find({applicant_id: req.body.applicant_id})
  .then((educs) => {
  educationn = educs;

  JobListing.findById(req.body.listing_id)
  .then((job) => {
  titl = job.title;
  sal = job.monthly_salary;
  jobType = job.job_type;

  if(req.body.sop.split(/\s+/).length > 250){
  res.status(400).send("SOP should not contain more than 250 words");
  } else {

  job.open_applications++;
  job.save();

  user.application_count++;
  user.save();


  const appl = new Application({
title: titl,
jobType: jobType,
applicant_id: req.body.applicant_id,
applicant_name: applicant_nam,
recruiter_name: recruiter_name,
applicant_rating: applicant_rat,
skills: skillsss,
education: educationn,
date_of_applying: req.body.date_of_applying,
sop: req.body.sop,
monthly_salary: sal,
recruiter_id: req.body.recruiter_id,
listing_id: req.body.listing_id,
stage_of_application: "Applied",
joining_date: new Date()
});

appl.save()
.then(appl => res.send('Application submitted successfully!'))
.catch(err => {
res.status(400).send('Error in submitting application');
});
}
});
})
.catch(err => res.status(400).send("Error in sending education details"));
})
.catch(err => res.status(400).send("Unknown error in getting skills"));
})
.catch(err => res.status(400).send("Invalid user entered"));
})
.catch(err => res.status(400).send("Invalid user entered"));
}

else
res.send('This listing is not accepting any more applications');
})
.catch(err => res.status(400).send('Invalid job'));  
}

else if(user.application_count >= 10)
	res.status(400).send('Applicant cannot have more than 10 open applications at a given time');

	else
	res.status(400).send('Applicant cannot apply if his application for another job is accepted');
	})
.catch(err => res.status(400).send('Invalid user')); */
});

// Get applications by id
router.get("/:id", (req, res) => {
		const id = req.params.id;
		Application.findById(id, (err, appl) => {
				if(err) res.status(404).send('Application not found')
				else res.json(appl);
				});
		});

// Update application by id
router.post("/update/status/:id", async(req, res) => {

    let appl = await Application.findById(req.params.id);
    if(req.body.stage_of_application !== "Accepted"){
        appl.stage_of_application = req.body.stage_of_application;

        if(appl.stage_of_application === "Rejected"){
            let job = await JobListing.findById(req.body.listing_id);
            job.open_applications--;
            await job.save();
            let user = await User.findById(req.body.applicant_id);
            user.application_count--;
			await user.save();
			await appl.save();
        } else {
            await appl.save();
        }
        res.status(200).send("Application Status Updated");
    } else {
        let user = await User.findById(req.body.applicant_id);
        user.application_count--;
		await user.save();
		let jobb = await JobListing.findById(req.body.listing_id);
        jobb.open_applications--;
        await jobb.save();
        
        if(!user.got_job){
			user.got_job = true;
	        user.curr_job_id = req.body.listing_id;
			await user.save();
		    appl.stage_of_application = "Accepted";
			appl.joining_date = new Date();
			await appl.save();
			
            let job = await JobListing.findById(req.body.listing_id);
            let appls = await Application.find({applicant_id: req.body.applicant_id});
            // setting all his other appls to rejected and updating those job open count
            if(appls){
                for(let i=0;i<appls.length;i++){
				    if(appls[i].stage_of_application !== "Deleted"
					&& appls[i]._id != req.params.id){
						appls[i].stage_of_application = "Rejected";
						await appls[i].save();
						user.application_count--;
						await user.save();

                        let jobby = await JobListing.findById(appls[i].listing_id);
                        if(jobby){
                            jobby.open_applications--;
							await jobby.save();
                        }
                    }
                }
            }

            // accepting
            job.accepted_applications++;
            await job.save();
            
            // all positions found, put all other appls to reject
            if(job.accepted_applications === job.max_positions){
                let job_appls = await Application.find({listing_id: job._id});
                for(let i=0;i<job_appls.length;i++){
                    if(job_appls[i].stage_of_application !== "Deleted"
                        && job_appls[i].stage_of_application !== "Accepted"
                        && job_appls[i]._id != req.params.id){
                    job_appls[i].stage_of_application = "Rejected";
					await job_appls[i].save();
					if(job_appls[i].applicant_id !== "-1"){
						let others = await User.findById(job_appls[i].applicant_id);
						others.application_count--;
						await others.save();	
						}
                    }
                }
			}

			var rec_deets; var rec_name = ''; var rec_email = '';
			if(req.body.rec_id !== "-1"){
				rec_deets = await User.findById(req.body.rec_id);
				rec_name = rec_deets.name;
				rec_email = rec_deets.email;
			}
			
			var transporter = nodemailer.createTransport(smtpTransport({
				service: 'gmail',
				host: 'smtp.gmail.com',
				auth: {
				  user: 'jobportalrecruiters@gmail.com',
				  pass: 'come2Work'
				}
			  }));
			  
			  var mailOptions = {
				from: 'jobportalrecruiters@gmail.com',
				to: user.email,
				subject: 'Acceptance of job application',
				text: 'Congratulations ' + user.name + '! Your application for the job '
					 + job.title + ' has been accepted by recruiter: ' + rec_name + 
					 ' (Email: ' + rec_email + '). More details regarding the job will be discussed with you by your recruiter. Thank you for using this app!'
			  };
			  
			  transporter.sendMail(mailOptions, function(error, info){
				if (error) {
				  console.log(error);
				} else {
				  console.log('Email sent: ' + info.response);
				}
			  });  

            res.status(200).send("Application status successfully updated");

        } else {
            appl.stage_of_application = "Rejected";
            await appl.save();
            res.status(400).send("Applicant status already has job");
        }
    }
		// applicant id and listing id are sent as reponse too
		/*Application.findById(req.params.id)
		.then(appl => {

				if(req.body.stage_of_application !== "Accepted"){

				appl.stage_of_application = req.body.stage_of_application;

				if(appl.stage_of_application === "Rejected"){
				JobListing.findById(req.body.listing_id)
				.then((job) => {
						job.open_applications--;
						job.save();
						User.findById(req.body.applicant_id)
						.then((user) => {
								user.application_count--;
								user.save();
								appl.save()
								.then(() => res.send('Stage of application updated!'))
								.catch(err => res.status(400).send('Error in updating stage of application'));
								})
						.catch(err => res.status(400).send("Error in finding user"));
						})
				.catch(err => res.status(400).send("Error in finding job"));
				} else {
					appl.save()
						.then(() => res.send('Stage of application updated!'))
						.catch(err => res.status(400).send('Error in updating stage of application'));
				}
				}

				else{
					// check if user has no accepted elsewhere
					User.findById(req.body.applicant_id)
						.then((user) => {
								user.application_count--;
								user.save();

								if(!user.got_job){
								// check if position is available for job in listing
								JobListing.findById(req.body.listing_id)
								.then((job) => {
										// put all other applications of this user undeleted to rejected
										Application.find({applicant_id: req.body.applicant_id})
										.then((appls) => {
												if(appls){
												for(let i=0;i<appls.length;i++)
												{
												if(appls[i].stage_of_application !== "Deleted"
														&& appls[i]._id != req.params.id){
												appls[i].stage_of_application = "Rejected";
												appls[i].save();

												// Every other job should have their open count decreased by 1
												JobListing.findById(appls[i].listing_id)
												.then((job) => {
														job.open_applications--;
														job.save();
														})
												.catch(err => res.status(400).send("Unknown error occured"));
												}
												}

												JobListing.findById(req.body.listing_id)
												.then((job) => {
														job.accepted_applications++;
														job.save();

														// All positions are filled
														if(job.accepted_applications === job.max_positions){
														Application.find({listing_id: job._id})
														.then((job_appls) => {
																for(let i=0;i<job_appls.length;i++){
																if(job_appls[i].stage_of_application !== "Deleted"
																		&& job_appls[i].stage_of_application !== "Accepted"
																		&& job_appls[i]._id != req.params.id){
																job_appls[i].stage_of_application = "Rejected";
																job_appls[i].save();
																}
																}

																User.findById(req.body.applicant_id)
																.then((user) => {
																		user.got_job = true;
																		user.curr_job_id = req.body.listing_id;
																		user.save();
																		appl.stage_of_application = "Accepted";
																		appl.joining_date = new Date();
																		appl.save()
																		.then(() => res.send('Stage of application updated!'))
																		.catch(err => res.status(400).send('Error in updating stage of application'));
																		})
																.catch(err => res.status(400).send("Error in finding user"));
														})
														.catch(err => res.status(400).send("Error in updation"));
														} else {

															User.findById(req.body.applicant_id)
																.then((user) => {
																		user.got_job = true;
																		user.curr_job_id = req.body.listing_id;
																		user.save();
																		appl.stage_of_application = "Accepted";
																		appl.joining_date = new Date();
																		appl.save()
																		.then(() => res.send('Stage of application updated!'))
																		.catch(err => res.status(400).send('Error in updating stage of application'));
																		})
															.catch(err => res.status(400).send("Error in finding user"));
														}
												});
												}
										})
										.catch(err => res.status(400).send("Application extraction error"));
								})
								.catch(err => res.status(400).send('Invalid job'));
								}

								else {
									JobListing.findById(req.body.listing_id)
										.then((job) => {
												job.open_applications--;
												job.save();
												});
									appl.stage_of_application = "Rejected";
									appl.save()
										.then(() => res.send('Applicant already got a job elsewhere!'))
										.catch(err => res.status(400).send('Error in updating stage of application'));
								}
						})
					.catch(err => res.status(400).send('Invalid user'));
				}
		})
		.catch(err => res.status(400).send('Error in updating'));*/
});

// Delete application by id
router.delete("/delete/:id", (req, res) => {
		Application.findByIdAndDelete(req.params.id)
		.then(() => res.json('Application deleted.'))
		.catch(err => res.status(400).send('Error in deleting'));
		});

module.exports = router;
