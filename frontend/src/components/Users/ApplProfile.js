import React, { Component } from "react";
import axios from "axios";
import "bootstrap/dist/js/bootstrap.bundle";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap";
var validator = require('validator');


export default class AppProfile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {},
      skills: [],
      education_details: [],
      other_skill: "C",
      ema: "",
      nam: "",
      inst: "",
      start_y: 0,
      end_y: 0
    };

    this.onUpdateSkill = this.onUpdateSkill.bind(this);
    this.onSubmitSkill = this.onSubmitSkill.bind(this);
    this.onRemoveSkill = this.onRemoveSkill.bind(this);
    this.onDeleteEducationDetail = this.onDeleteEducationDetail.bind(this);
    this.onAddEducationDetail = this.onAddEducationDetail.bind(this);
    this.onEditingEmail = this.onEditingEmail.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onEditingName = this.onEditingName.bind(this);
    this.onChangeName = this.onChangeName.bind(this);

    this.onChangeInst = this.onChangeInst.bind(this);
    this.onChangeStartYear = this.onChangeStartYear.bind(this);
    this.onChangeEndYear = this.onChangeEndYear.bind(this);
  }

  componentDidMount() {

    axios.get("/user/profile/" + localStorage.getItem("id"))
    .then(res => this.setState({ user: res.data, 
      ema : res.data.email,
      nam: res.data.name
    }));
    axios.get("/user/profile/education/" + localStorage.getItem("id"))
    .then(res => this.setState({ 
      education_details: res.data
     }));
    axios.get("/user/profile/skills/" + localStorage.getItem("id"))
    .then(res => this.setState({ skills: res.data }));
  }

  onChangeEmail(e){
    this.setState({ema: e.target.value});
  }

  onEditingEmail(e){
    e.preventDefault();
    var req = {
      email: this.state.ema,
      idVal: localStorage.getItem("id")
    };

    if(validator.isEmail(req.email + '')){
      console.log(req);
      axios
        .post("/user/profile/update_email/", req)
        .then((res) => {
          console.log(res);
          localStorage.setItem("email", this.state.ema);
     window.location.href = "/user_profile";

        })
        .catch((err) => {
          if (err.response.data) alert(err.response.data);
     window.location.href = "/user_profile";

        });
    } else {
      alert("A valid Email should be entered while updating");
      window.location.href = "/user_profile";
    }
  }

  onChangeInst(e){
    this.setState({inst: e.target.value});
  }

  onChangeStartYear(e){
    this.setState({start_y: e.target.value});
  }

  onChangeEndYear(e){
    this.setState({end_y: e.target.value});
  }

  onChangeName(e){
    this.setState({nam: e.target.value});
  }

  onEditingName(e){
    e.preventDefault();
    var req = {
      name: this.state.nam,
      idVal: localStorage.getItem("id")
    };

    console.log(req);

    axios
      .post("/user/profile/update_name/", req)
      .then((res) => {
        console.log(res);
   window.location.href = "/user_profile";

      })
      .catch((err) => {
        if (err.response.data) alert(err.response.data);
   window.location.href = "/user_profile";

      });
  }

  onAddEducationDetail(e) {
    e.preventDefault();
    var institute_name = this.state.inst;
    var start_year = this.state.start_y;
    var end_year = this.state.end_y;

    if(validator.isEmpty(institute_name + '')){
      alert("Institute name cannot be empty");
      window.location.href = "/user_profile";
      this.setState({
        inst: "",
        start_y: 0,
        end_y: 0
      });
    } else if(!validator.isInt(start_year + '', {min: 1900, max: 2021})){
      alert("Entering a valid Starting year is compulsory");
      window.location.href = "/user_profile";
      this.setState({
        inst: "",
        start_y: 0,
        end_y: 0
      });
    } else if(!validator.isEmpty(end_year + '') && 
          !validator.isInt(end_year + '', {min: 0, max: 2021})){
      alert("End year should be coherent with start year and should be a valid value if entered");
      window.location.href = "/user_profile";
      this.setState({
        inst: "",
        start_y: 0,
        end_y: 0
      });
    } else{
      if(validator.isEmpty(end_year + '')){
        alert("Please read form instructions and enter value accordingly");
        window.location.href = "/user_profile";
        this.setState({
          inst: "",
          start_y: 0,
          end_y: 0
        });
      } else if(end_year === 0 || end_year >= start_year){
          var req = {
            applicant_id: localStorage.getItem("id"),
            institute_name: institute_name,
            start_year: start_year,
            end_year: end_year
        };
    
        axios
          .post("/user/profile/add/education", req)
          .then((res) => {
            console.log(res);
        window.location.href = "/user_profile";

          })
          .catch((err) => {
            if (err.response.data) alert(err.response.data);
        window.location.href = "/user_profile";

          });
        this.setState({
          inst: "",
          start_y: 0,
          end_y: 0
        });
      } else {
      alert("End year should be coherent with start year");
      window.location.href = "/user_profile";
      this.setState({
        inst: "",
        start_y: 0,
        end_y: 0
      });
      }
    }
}

  onDeleteEducationDetail(education) {

    var req = {
      education_id: education._id,
    };
    axios.delete("/user/profile/delete_education/" + education._id, req)
    .then((res) => {})
    .catch((err) => {
      if (err.response.data) alert(err.response.data);
    });
    window.location.href = "/user_profile";
  }

  onUpdateSkill(event) {
    this.setState({ other_skill: event.target.value });
  }

  onRemoveSkill(skill) {
 
    var req = {
      skill_id: skill._id,
    };
    console.log(req);
    axios.delete("/user/profile/delete_skills/" + skill._id, req)
    .then((res) => {})
    .catch((err) => {
      if (err.response.data) alert(err.response.data);
    });
   window.location.href = "/user_profile";

  }

  onSubmitSkill(e) {
    e.preventDefault();
    var skillVal;

    if(this.state.other_skill === "Others"){
      skillVal = window.prompt("Enter Skill to be added: ");

      if(validator.isEmpty(skillVal + '')){
        alert("Skill value cannot be empty");
      }
    } else {
      skillVal = this.state.other_skill;
    }

    var req = {
      applicant_id: localStorage.getItem("id"),
      skill: skillVal
    };

    if(!validator.isEmpty(skillVal + '')){
    axios
      .post("/user/profile/add/skills", req)
      .then((res) => {
        console.log(res);
    window.location.href = "/user_profile";

      })
      .catch((err) => {
        if (err.response.data) alert(err.response.data);
    window.location.href = "/user_profile";

      });
    }

    this.setState({ other_skill: "C"});
  }

  render() {

    function displaySkills(arg) {
      if (arg.state.skills.length === 0) {
        return (
          <div>
            <h4>No skills to display</h4>
          </div>
        );
      } else {
            return (
            <div>
            {
            arg.state.skills.map((element, idx) => {
                return (
                <div>
                    <p> {element.skill}</p>
                    <Button
                    variant="danger"
                    className="btn btn-primary"
                    value="delete"
                    onClick={() => arg.onRemoveSkill(element)}
                    >
                    Delete Skill
                    </Button>
                    <br></br>
                    <br></br>
                    <br></br>
                </div>
                );
            })}
            </div>
            );
        }
    }

    function displayEducationDetails(arg) {
      if (arg.state.education_details.length === 0) {
        return (
          <div>
            <h4>No Education Information to display</h4>
          </div>
        );
      } else {
        return (
            <div>
            {
            arg.state.education_details.map((element, idx) => {
                return (
                <div>
                    <p><strong>Institute: </strong>{element.institute_name}</p>
                    <p><strong>Start Year: </strong>{element.start_year}</p>
                    <p><strong>End Year: </strong>{(element.end_year === 0) ? "Not mentioned" : element.end_year}</p>
                    <Button
                    variant="danger"
                    className="btn btn-primary"
                    value="delete"
                    onClick={() => arg.onDeleteEducationDetail(element)}
                    >
                    Delete Education Detail
                    </Button>
                    <br></br>
                    <br></br>
                    <br></br>
                </div>
                );
            })}
            </div>
          );    
       }
    }
    

    function avg_rating(arg) {
      if (arg.state.user.number_rated === 0) {
        return <h4><strong>My Rating: </strong>Not rated</h4>;
      } else {
        return (
          <h4>
            <strong>My Rating:</strong>{" "}{arg.state.user.sum_rated / arg.state.user.number_rated}
          </h4>
        );
      }
    }

    return (
      <div>
      <Form onSubmit={this.onEditingName} noValidate>
                      <div class="form-group">
                        <label for="name">Name: </label>
                        <input type="text" class="form-control"
                        name="name" onChange={this.onChangeName}
                         value={this.state.nam}
                        />
                      </div>
                    <br/>
                      <div className="form-group">
                        <input type="submit" value="Update Name" className="btn btn-primary" />
                      </div>
                      <br></br>
                      <br></br>
        </Form>

        <Form onSubmit={this.onEditingEmail} noValidate>
                      <div class="form-group">
                        <label for="email">Email: </label>
                        <input type="email" class="form-control"
                        name="Email" onChange={this.onChangeEmail}
                         value={this.state.ema}
                        />
                      </div>
                    <br/>
                      <div className="form-group">
                        <input type="submit" value="Update Email" className="btn btn-primary" />
                      </div>
                      <br></br>
                      <br></br>
        </Form>

        <div>{avg_rating(this)}</div>
        <br/>

        <h4>Skills: </h4>{displaySkills(this)}
        <Form onSubmit={this.onSubmitSkill}>
          <Form.Group controlId="exampleForm.ControlSelect1">
            <Form.Label>Skill</Form.Label>
            <Form.Control
              as="select" value={this.state.other_skill}
              onChange={this.onUpdateSkill}
              inputRef={(el) => (this.inputEl = el)}
            >
              <option value="C">C</option>
              <option value="C++">C++</option>
              <option value="Java">Java</option>
              <option value="Python">Python</option>
              <option value="Others">Others</option>
            </Form.Control>
            <br></br>
            <br></br>
          </Form.Group>
          <div className="form-group">
            <input
              type="submit" value="Add New Skill"
              className="btn btn-primary"
            />
          </div>
          <br></br>
          <br></br>
          <br></br>
        </Form>

        <h4>Education Details: </h4>
        <div>{displayEducationDetails(this)}</div>
        <br/>
        <br/>
        <h6>Add Educational Details here</h6>

        <Form onSubmit={this.onAddEducationDetail}>
          <div class="form-group">
                          <label for="inst_name">Institute Name: </label>
                          <input type="text" class="form-control"
                          name="inst_name" onChange={this.onChangeInst}
                          value={this.state.inst}
                          />
          </div>
          <br/>
          <div class="form-group">
                          <label for="start_year">Start Year: </label>
                          <input type="number" class="form-control"
                          name="start_year" onChange={this.onChangeStartYear}
                          value={this.state.start_y}
                          />
          </div>
          <br/>
          <div class="form-group">
                          <label for="end_year">End Year: <p>(Enter 0 if not finished yet)</p></label>
                          <input type="number" class="form-control"
                          name="end_year" onChange={this.onChangeEndYear}
                          value={this.state.end_y}
                          />
          </div>
          <br/>
          <div className="form-group">
                  <input type="submit" value="Insert Educational Information" className="btn btn-warning" />
          </div>
          <br/>
          <br/>
        </Form>
        <br></br>
      </div>
    );
  }
}
