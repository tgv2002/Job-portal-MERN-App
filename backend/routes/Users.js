var express = require("express");
var router = express.Router();
const bcrypt = require("bcryptjs");
const key = require("../config/key");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const isEmpty = require("is-empty");
// Load User model
const User = require("../models/Users");
const Edu = require("../models/Education");
const Skill = require("../models/Skills");
const JobListing = require("../models/JobListings");
const Application = require("../models/Applications");

// GET request 
// Getting all the users
router.get("/profile", (req, res) => {
    User.find(function(err, users) {
		if (err) {
			console.log(err);
		} else {
			res.json(users);
		}
	})
});

// Getting all the users education
router.get("/profile/education", (req, res) => {
  Edu.find(function(err, educ) {
  if (err) {
    console.log(err);
  } else {
    res.json(educ);
  }
})
});

// Getting all skills of user
router.get("/profile/skills", (req, res) => {
  Skill.find(function(err, skill) {
  if (err) {
    console.log(err);
  } else {
    res.json(skill);
  }
})
});

// Get user by id
router.get("/profile/:id", (req, res) => {
    const id = req.params.id;
    User.findById(id, (err, user) => {
        if(err) res.status(404).send('User not found')
        else res.json(user);
    });
});

// Get user education by user id
router.get("/profile/education/:id", (req, res) => {
  const id = req.params.id;
  Edu.find({applicant_id: id})
    .then(education => res.status(200).json(education))
    .catch((err) => {
      res.status(400).send("Detail not found");
    });
});

// Get all applicants accepted by this recruiter
router.get("/accepted_applicants/:id", async(req, res) => {

  let acc_appl = [];

  let accepted_appls = await Application.find({recruiter_id: req.params.id, stage_of_application: "Accepted"});
  if(accepted_appls){
        for(let i=0;i<accepted_appls.length;i++)
        {
            let user = await User.findById(accepted_appls[i].applicant_id);
            let rat = (user.number_rated === 0) ? 0 : (user.sum_rated/user.number_rated);
            let naam = user.name;

            //console.log("Below is user " + i);
            acc_appl.push({
              applicant_id: accepted_appls[i].applicant_id,
              listing_id: accepted_appls[i].listing_id,
              applicant_name: naam,
              joining_date: accepted_appls[i].joining_date,
              jobType: accepted_appls[i].jobType,
              title: accepted_appls[i].title,
              applicant_rating: rat,
              rated_applicant: accepted_appls[i].rated_applicant,
             // stage_of_application: accepted_appls[i].stage_of_application,
            });
          }
          res.status(200).json(acc_appl);
  } else {
    res.status(400).send("Error in getting applications");
  }

  /*Application.find({recruiter_id: req.params.id, stage_of_application: "Accepted"})
    .then((accepted_appls) => {
      if(accepted_appls){
        for(let i=0;i<accepted_appls.length;i++)
        {
            //console.log("Below is user " + i);
            acc_appl.push({
              applicant_id: accepted_appls[i].applicant_id,
              listing_id: accepted_appls[i].listing_id,
              applicant_name: accepted_appls[i].applicant_name,
              joining_date: accepted_appls[i].joining_date,
              jobType: accepted_appls[i].jobType,
              title: accepted_appls[i].title,
              applicant_rating: accepted_appls[i].applicant_rating,
              rated_applicant: accepted_appls[i].rated_applicant,
             // stage_of_application: accepted_appls[i].stage_of_application,
            });
            //console.log(acc_appl[i]);
        }
      }
      //console.log("BYEEE");
      res.send(acc_appl);
    })
    .catch(err => res.status(400).send("Unknown error occured"));*/
});

// Get user skills by user id
router.get("/profile/skills/:id", (req, res) => {
  const id = req.params.id;
  Skill.find({applicant_id: id})
    .then(skill => res.status(200).json(skill))
    .catch((err) => {
      res.status(400).send("Skill not found");
    });
});

// applicant rating
router.post("/profile/rating/:id", (req, res) => {
  User.findById(req.params.id)
    .then(user => {
      if(req.body.rating >= 0 && req.body.rating <= 5) {
        user.sum_rated += req.body.rating;
        user.number_rated++;

      Application.find({listing_id: req.body.listing_id, applicant_id: req.params.id})
        .then((appl) => {
          //console.log(appl);
          appl[0].rated_applicant = true;
          appl[0].save();
          //console.log(appl);
          //console.log(user);
          user.save()
          .then(() => res.send('User rating updated!'))
          .catch((err) => {
            res.status(400).send("Rating update failed");
          });
        })
        .catch((err) =>{ //console.log(err);
          res.status(400).send("Unknown error occurred")});
      }

      else
      res.status(400).send("Enter a valid rating in the range 0-5");
    })
    .catch((err) => {
      res.status(400).send("Rating update failed");
    });
  
});

// Update user name by user id
router.post("/profile/update_name/", (req, res) => {

  User.findById(req.body.idVal)
    .then(user => {
      if(!isEmpty(req.body.name)) user.name = req.body.name;
      user.save()
        .then(() => {res.send('User Info updated!');})
        .catch(err => {res.status(400).send("Update failed");});
    })
    .catch(err => res.status(400).send("User not found"));
});

// Update user email by user id
router.post("/profile/update_email/", (req, res) => {

  User.findById(req.body.idVal)
    .then(user => {
      if(!isEmpty(req.body.email)) user.email = req.body.email;
      user.save()
        .then(() => {res.send('User Info updated!');})
        .catch(err => {res.status(400).send("Update failed");});
    })
    .catch(err => res.status(400).send("User not found"));
});


// Update user contact by user id
router.post("/profile/update_contact/:id", (req, res) => {

  User.findById(req.params.id)
    .then(user => {
      if(!isEmpty(req.body.contact)) user.contact = req.body.contact;
      user.save()
        .then(() => res.send('User Info updated!'))
        .catch(err => res.status(400).send("Update failed"));
    })
    .catch(err => res.status(400).send("User not found"));
});

// Update user bio by user id
router.post("/profile/update_bio/:id", (req, res) => {

  User.findById(req.params.id)
    .then(user => {
      if(req.body.bio.split(/\s+/).length > 250){
        res.status(400).send("Bio should not contain more than 250 words");
    } else {
      if(!isEmpty(req.body.bio)) user.bio = req.body.bio;
      user.save()
        .then(() => res.send('User Info updated!'))
        .catch(err => res.status(400).send("Update failed"));
      }
    })
    .catch(err => res.status(400).send("User not found"));
});

router.post("/profile/update/education", (req, res) => {
  
    Edu.findById(req.body.education_id)
    .then(edu => {

      if(!isEmpty(req.body.institute_name)) edu.institute_name = req.body.institute_name;
      if(!isEmpty(req.body.start_year)) edu.start_year = req.body.start_year;
      if(req.body.end_year !== 0) edu.end_year = req.body.end_year;

      edu.save()
        .then(() => res.send('User education Info updated!'))
        .catch(err => res.status(400).send("Update failed"));
    })
    .catch(err => res.status(400).send("Update failed"));

});

router.post("/profile/add/education", (req, res) => {

  const educ = new Edu(req.body);
    educ.save()
        .then(() => {
            res.status(200).json({'id': educ._id});
        })
        .catch(err => {
            res.status(400).send('Error in adding');
        });
});

router.post("/profile/add/skills", (req, res) => {

  const skill = new Skill(req.body);
    skill.save()
        .then(job => {
            res.status(200).json({'id': skill._id});
        })
        .catch(err => {
            res.status(400).send('Error in adding');
        });
});

// Delete user account by id
router.delete("/profile/delete/:id", (req, res) => {
  User.findByIdAndDelete(req.params.id)
    .then(() => res.send('User deleted.'))
    .catch(err => res.status(400).send('Error in deleting'));
});

// Delete education account by education id
router.delete("/profile/delete_education/:id", (req, res) => {
  /*Edu.delete({_id: req.body.education_id})
    .then(() => res.send('Education detail deleted.'))
    .catch(err => res.status(400).json('Error: ' + err));*/
    Edu.findByIdAndDelete(req.params.id)
    .then(() => res.send('Education detail deleted.'))
    .catch(err => res.status(400).send('Error in deleting'));
});

// Delete skills account by skill id
router.delete("/profile/delete_skills/:id", (req, res) => {
  /*Skill.delete({_id: req.body.skill_id})
    .then(() => res.send('Skill detail deleted.'))
    .catch(err => res.status(400).json('Error: ' + err));*/
    Skill.findByIdAndDelete(req.params.id)
    .then(() => res.send('Skill detail deleted.'))
    .catch(err => res.status(400).send('Error in deleting'));
});

// Delete user education by user id
router.delete("/profile/delete/education/:id", (req, res) => {

   Edu.deleteMany({applicant_id :req.params.id})
    .then(() => res.send('User deleted.'))
    .catch(err => res.status(400).send('Error in deleting'));
});

// Delete user skills by user id
router.delete("/profile/delete/skills/:id", (req, res) => {

  Skill.deleteMany({applicant_id :req.params.id})
   .then(() => res.send('User deleted.'))
   .catch(err => res.status(400).send('Error in deleting'));
});

// POST request 
// Add a user to db
router.post("/register", (req, res) => {

        // Validate input
        if(isEmpty(req.body.email))  return res.status(400).send("E-mail is compulsory");
        if(isEmpty(req.body.password))  return res.status(400).send("Password is compulsory");
        if(isEmpty(req.body.type))  return res.status(400).send("Type is compulsory");

        User.findOne({ email: req.body.email})
            .then(user => {
                if (user) {
                return res.status(400).send("E-mail already exists");
                }
                else {
                const newUser = new User({
                    email: req.body.email,
                    password: req.body.password,
                    type: req.body.type,
                    });

                // Hash password with bcrypt
                bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    
                    newUser
                    .save()
                    .then(user => res.status(200).json(user))
                    .catch(err => {console.log(err);res.status(400).send("Couldn't store password");})
            });
        });
     }
  });
});

// POST request 
// Login
router.post("/login", (req, res) => {

    // Validate input
    if(isEmpty(req.body.email))  return res.status(400).send("E-mail is compulsory");
    if(isEmpty(req.body.password))  return res.status(400).send("Password is compulsory");

    const email = req.body.email;
    const password = req.body.password;

	// Find user by email
	User.findOne({ email }).then(user => {
		// Check if user email exists
		if (!user) {
			return res.status(404).send("Email not found");
    }

    else{
          // Compare password
        bcrypt.compare(password, user.password).then(isMatch => {
            if (isMatch) {
              // Password matched, create JWT payload
        
              const payload = {
                id: user.id,
                email: user.email
              }; 
          
              // Sign token
              jwt.sign(
                payload,
                key.jSecret,
                {
                  expiresIn: 3600 // Expires in an hour
                },
                (err, token) => {
                  res.json({
                    success: true,
                    token: "User " + token,
                    id: user._id,
                    type: user.type,
                    email: user.email
                  });
                }
              );
            } else {
              return res
                .status(400)
                .send("Incorrect password, authorization failed");
            }
	      });
      }
  });
});

module.exports = router;
