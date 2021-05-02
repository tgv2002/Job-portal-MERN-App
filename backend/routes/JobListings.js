var express = require("express");
var router = express.Router();
const bcrypt = require("bcryptjs");
const key = require("../config/key");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const isEmpty = require("is-empty");
// Load User model
const JobListing = require("../models/JobListings");
const Application = require("../models/Applications");
const User = require("../models/Users");

// GET request 
// Getting all the active jobListings --- applicant friendly
router.get("/", async(req, res) => {

    let jobs = await JobListing.find();
    if(jobs){
      for(let i=0;i<jobs.length;i++){
        if((new Date()) >= new Date(jobs[i].deadline)){
          jobs[i].status = "Expired";
          await jobs[i].save();
        } else if(jobs[i].status === "Expired"){
          jobs[i].status = "Active";
          await jobs[i].save();
        }

        if(jobs[i].recruiter_id !== "-1"){
        let reccy = await User.findById(jobs[i].recruiter_id);
        jobs[i].recruiter_name = reccy.name;
        jobs[i].recruiter_email = reccy.email;
        await jobs[i].save();
        }
      }
    }

    let req_jobs = await JobListing.find({status: "Active"});
    if(req_jobs) res.status(200).json(req_jobs);
    else res.status(400).send("Jobs not found");
    
    /*JobListing.find().
    then((jobs) => {
      if(jobs){
        for(let i=0;i<jobs.length;i++)
        {
            if((new Date()) >= new Date(jobs[i].deadline)){
              jobs[i].status = "Expired";
              jobs[i].save();
            } else if(jobs[i].status === "Expired"){
              jobs[i].status = "Active";
              jobs[i].save();
            }
        }
      }

      JobListing.find({status: "Active"})
      .then(jobs => res.status(200).json(jobs))
      .catch((err) => {
        res.status(400).send("Jobs not found");
      });
    });*/

});

// Gets all job listings for a recruiter
router.get("/all/:id", async(req, res) => {

    let jobss = await JobListing.find();
    if(jobss){
      for(let i=0;i<jobss.length;i++){
        if((new Date()) >= new Date(jobss[i].deadline)){
          jobss[i].status = "Expired";
          await jobss[i].save();
        } else if(jobss[i].status === "Expired"){
          jobss[i].status = "Active";
          await jobss[i].save();
        }
      }
    }

  var active_jobs = [];
  let jobs = await JobListing.find({recruiter_id: req.params.id});
  if(jobs){
    for(let i=0;i<jobs.length;i++)
    {
      if(jobs[i].accepted_applications < jobs[i].max_positions){
          active_jobs.push(jobs[i]);
        }
    }
  }
  res.json(active_jobs);

  /*JobListing.find({recruiter_id: req.params.id}).
    then((jobs) => {
      if(jobs){
        for(let i=0;i<jobs.length;i++)
        {
          if(jobs[i].accepted_applications < jobs[i].max_positions){
              active_jobs.push(jobs[i]);
            }
        }
      }
      res.json(active_jobs);
    })
    .catch((err) => res.status(400).send("No jobs found"));*/
});

// Adding new jobs
router.post("/add", (req, res) => {

  var naam; var rat; var emaill;

  User.findById(req.body.recruiter_id)
  .then((user) => {
    //console.log("Here here");
    naam = user.name;
    rat = (user.number_rated === 0) ? 0 : (user.sum_rated/user.number_rated);
    emaill = user.email;

    //console.log({name: naam, rate: rat, email: emaill});
    const job = new JobListing({
      title: req.body.title,
      status: "Active",
      recruiter_name: naam,
      recruiter_email: emaill,
      recruiter_rating: rat,
      recruiter_id: req.body.recruiter_id,
      open_applications: 0,
      max_applications: req.body.max_applications,
      accepted_applications: 0,
      max_positions: req.body.max_positions,
      date_of_posting: new Date(),
      deadline: req.body.deadline,
      skill_set: req.body.skill_set,
      job_type: req.body.job_type,
      duration: req.body.duration,
      monthly_salary: req.body.monthly_salary,
      number_rated: 0,
      sum_rated: 0
    });

   //console.log('WEEEEEEEEEEEEEEEEEEEEEEEEEEEE');
    job.save()
      .then(job => {
     //     console.log(job);
          res.status(200).send('Job added Successfully');
      })
      .catch(err => {
       //   console.log(err);
          res.status(400).send('Error in adding');
      });

  })
  .catch(err => res.status(400).send("Invalid recruiter"));

    
});

// Get job by id
router.get("/:id", (req, res) => {
    const id = req.params.id;
    JobListing.findById(id, (err, job) => {
        if(err) res.status(404).send('Job not found')
        else {
          if((new Date()) >= new Date(job.deadline)){
            job.status = "Expired";
            job.save();
          } else if(job.status === "Expired"){
            job.status = "Active";
            job.save();
          }
          res.json(job);
        }
    });
});

// Update job by id
/*router.post("/update/:id", (req, res) => {
    JobListing.findById(req.params.id)
    .then(job => {
      if(!isEmpty(req.body.title)) job.title = req.body.title;
      if(!isEmpty(req.body.skill_set)) job.skill_set = req.body.skill_set;
      if(!isEmpty(req.body.max_applications)) job.max_applications = req.body.max_applications;
      if(!isEmpty(req.body.max_positions)) job.max_positions = req.body.max_positions;
      if(!isEmpty(req.body.date_of_posting)) job.date_of_posting = req.body.date_of_posting;
      if(!isEmpty(req.body.deadline)) job.deadline = req.body.deadline;
      if(!isEmpty(req.body.job_type)) job.job_type = req.body.job_type;
      if(!isEmpty(req.body.duration)) job.duration = req.body.duration;
      if(!isEmpty(req.body.monthly_salary)) job.monthly_salary = req.body.monthly_salary;

      job.save()
        .then(() => res.send('Job Listing updated!'))
        .catch(err => res.status(400).send('Error occured while updating'));
    })
    .catch(err => res.status(400).send('Error in updating'));

});*/

router.post("/update/applicants/:id", (req, res) => {
  let flagg = 0;
  JobListing.findById(req.params.id)
  .then(job => {

    if(/*job.max_applications === job.open_applications ||*/
      job.accepted_applications === job.max_positions){
        res.status(400).send("Field cannot be updated as there are no vacancies");
      } else{
      if(!isEmpty(req.body.max_applications)) {
        if(req.body.max_applications >= job.open_applications)
          job.max_applications = req.body.max_applications;
        else
        {
          flagg = 1;
          res.status(400).send('Maximum number of applications cannot be less than currently open applications');
        }
      }

      if(flagg === 0){
        job.save()
          .then(() => res.send('Job Listing position count updated!'))
          .catch(err => res.status(400).send('Error occured while updating'));
      }
    }
  })
  .catch(err => res.status(400).send('Error in updating'));
});

router.post("/update/deadline/:id", (req, res) => {
  let flagg = 0;
  JobListing.findById(req.params.id)
  .then(job => {

    if(/*job.max_applications === job.open_applications ||*/
      job.accepted_applications === job.max_positions){
        res.status(400).send("Field cannot be updated as there are no vacancies");
      } else{
      if(!isEmpty(req.body.deadline)) {
        if(new Date(req.body.deadline) >= (new Date()))
          job.deadline = req.body.deadline;
        else
        {
          flagg = 1;
          res.status(400).send('Deadline cannot be before current date');
        }
      }

      if(flagg === 0){
        job.save()
          .then(() => res.send('Job Listing deadline updated!'))
          .catch(err => res.status(400).send('Error occured while updating'));
      }
    }
  })
  .catch(err => res.status(400).send('Error in updating'));
});

/*router.post("/update/status/:id", (req, res) => {
  JobListing.findById(req.params.id)
  .then(job => {
    if((new Date()) >= job.deadline) job.status = "Expired";

    job.save()
      .then(() => res.send('Deadline passed!'))
      .catch(err => res.status(400).send('Error occured while checking deadline'));
  })
  .catch(err => res.status(400).send('Error in finding job'));
});*/

router.post("/update/positions/:id", (req, res) => {
  let flagg = 0;
  JobListing.findById(req.params.id)
  .then(job => {

    if(/*job.max_applications === job.open_applications ||*/
      job.accepted_applications === job.max_positions){
        res.status(400).send("Field cannot be updated as there are no vacancies");
      } else {
      if(!isEmpty(req.body.max_positions)) {
        if(req.body.max_positions >= job.accepted_applications)
          job.max_positions = req.body.max_positions;
        else
        {
          flagg = 1;
          res.status(400).send('Maximum number of positions cannot be less than currently accepted applications');
        }
      }

      if(flagg === 0){
        job.save()
          .then(() => res.send('Job Listing position count updated!'))
          .catch(err => res.status(400).send('Error occured while updating'));
      }
    }
  })
  .catch(err => res.status(400).send('Error in updating'));
});

router.post("/rating/:id", (req, res) => {
    JobListing.findById(req.params.id)
      .then(job => {
        if(req.body.rating >= 0 && req.body.rating <= 5) {
          job.sum_rated += req.body.rating;
          job.number_rated++;

        Application.find({listing_id: req.params.id, applicant_id: req.body.applicant_id})
        .then((appl) => {
          //console.log("Right path bro!");
          appl[0].rated_job = true;
          appl[0].save();
          job.save()
          .then(() => res.send('Job rating updated!'))
          .catch((err) => {
            res.status(400).send("Rating update failed");
          });
        })
       .catch((err) => res.status(400).send("Unknown error occurred"));
      } else {
        res.status(400).send("Enter a valid rating in range 0-5");
        }
      })
      .catch((err) => {
        res.status(400).send("Rating update failed");
      }); 
  });


// Delete job by job id
router.delete("/delete/:id", async(req, res) => {

  let appls = await Application.find({listing_id: req.params.id});
  if(appls){
            for(let i=0;i<appls.length;i++)
            {
              if(appls[i].stage_of_application === "Accepted"){
                  let user = await User.findById(appls[i].applicant_id);
                  if(user){
                  user.got_job = false;
                  user.curr_job_id = "-1";
                  await user.save();
                  }
                  appls[i].stage_of_application = "Deleted";
                  await appls[i].save();
              } else {
                appls[i].stage_of_application = "Deleted";
                await appls[i].save();
              }
          }
  }

  await JobListing.findByIdAndDelete(req.params.id);
  return res.status(200).send("Job successfully deleted");

    /*JobListing.findByIdAndDelete(req.params.id)
    .then(() => {
      Application.find({listing_id: req.params.id})
      .then((appls) => {
          if(appls){
            for(let i=0;i<appls.length;i++)
            {
              if(appls[i].stage_of_application === "Accepted"){
                User.findById(appls[i].applicant_id)
                .then((user) => {
                  user.got_job = false;
                  user.curr_job_id = "-1";
                  user.save();
                  appls[i].stage_of_application = "Deleted";
                  appls[i].save();
                });
              } else {
                appls[i].stage_of_application = "Deleted";
                appls[i].save();
              }
            }
        }
        
        res.send('Job is deleted successfully');
      })
      .catch((err) => {
        res.status(400).send("No one applied to this job");
      });
    })
    .catch(err => res.status(400).send('Error in deleting'));*/
});

module.exports = router;
