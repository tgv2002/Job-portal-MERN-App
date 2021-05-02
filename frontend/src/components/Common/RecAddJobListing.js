import React, { Component } from "react";
import axios from "axios";
import "bootstrap/dist/js/bootstrap.bundle";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap";
import TextField from '@material-ui/core/TextField';
import date from "date-and-time";
import { MDBContainer, MDBRow, MDBCol } from "mdbreact";
var validator = require('validator');

export default class JobListings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // properties
      title: '',
      max_applications: 0,
      max_positions: 0,
      job_type: 'Full time',
      duration: 0,
      monthly_salary: 0,
      skill_set: '',
      deadline: new Date()
    };

    // properties
    this.onChangeTitle = this.onChangeTitle.bind(this);
    this.onChangeAppl = this.onChangeAppl.bind(this);
    this.onChangePos = this.onChangePos.bind(this);
    this.onChangeJobType = this.onChangeJobType.bind(this);
    this.onChangeDuration = this.onChangeDuration.bind(this);
    this.onChangeSalary = this.onChangeSalary.bind(this);
    this.onChangeSkill = this.onChangeSkill.bind(this);
    this.onChangeDeadline = this.onChangeDeadline.bind(this);
    this.onAddingJob = this.onAddingJob.bind(this);
    this.dateFormat = this.dateFormat.bind(this);
  }

  componentDidMount() {
    /*axios.get("/listings/")
    .then(res => this.setState({ job_listings: res.data }));
    axios.get("/application/user/" + localStorage.getItem("id"))
    .then(res => this.setState({ myApplications: res.data }));*/
  }

  dateFormat(deadline_value) {
    return date.format(new Date(deadline_value), "YYYY-MM-DD[T]HH:mm");
  }

  onChangeTitle(event) {
    this.setState({ title: event.target.value });
  }

  onChangeAppl(event) {
    this.setState({ max_applications: event.target.value });
  }

  onChangePos(event) {
    this.setState({ max_positions: event.target.value });
  }

  onChangeJobType(event) {
    this.setState({ job_type: event.target.value });
  }

  onChangeDuration(event) {
    var val = parseInt(event.target.value);
    this.setState({ duration: val });
  }

  onChangeSalary(event) {
    this.setState({ monthly_salary: event.target.value });
  }

  onChangeSkill(event) {
    this.setState({ skill_set: event.target.value });
  }

  onChangeDeadline(e) {
   // this.setState({ deadline: document.getElementById("datetime-local").value });
    this.setState({ deadline: e.target.value });
  }

onAddingJob(e) {
  e.preventDefault();

  var req = {
    title: this.state.title,
    status: "Active",
    recruiter_id: localStorage.getItem("id"),
    open_applications: 0,
    max_applications: this.state.max_applications,
    accepted_applications: 0,
    max_positions: this.state.max_positions,
    date_of_posting: new Date(),
    deadline: this.state.deadline,
    skill_set: this.state.skill_set,
    job_type: this.state.job_type,
    duration: this.state.duration,
    monthly_salary: this.state.monthly_salary,
    number_rated: 0,
    sum_rated: 0
  };

  if(validator.isEmpty(req.title + '')){
    alert("Job title cannot be empty");
    window.location.href = "/add_job_listing";

    this.setState({
      title: '',
      max_applications: 0,
      max_positions: 0,
      job_type: "Full time",
      duration: 0,
      monthly_salary: 0,
      skill_set: '',
      deadline: new Date()
    });
  } else {
    if(!validator.isInt(req.max_applications + '', {min: 1})){
      alert("Maximum applications must be a positive integer");
      window.location.href = "/add_job_listing";
      this.setState({
        title: '',
        max_applications: 0,
        max_positions: 0,
        job_type: "Full time",
        duration: 0,
        monthly_salary: 0,
        skill_set: '',
        deadline: new Date()
      });
    } else {
      if(!validator.isInt(req.max_positions + '', {min: 1})){
        alert("Maximum number of job offerings must be a positive integer");
      window.location.href = "/add_job_listing";
        this.setState({
          title: '',
          max_applications: 0,
          max_positions: 0,
          job_type: "Full time",
          duration: 0,
          monthly_salary: 0,
          skill_set: '',
          deadline: new Date()
        });
      } else {
        if(!validator.isAfter((req.deadline) + '')){
          alert("Deadline cannot be before current date");
      window.location.href = "/add_job_listing";

          this.setState({
            title: '',
            max_applications: 0,
            max_positions: 0,
            job_type: "Full time",
            duration: 0,
            monthly_salary: 0,
            skill_set: '',
            deadline: new Date()
          });
        } else {
            if(validator.isEmpty(req.skill_set + '')){
              alert("Skill set required MUST be specified");
      window.location.href = "/add_job_listing";

              this.setState({
                title: '',
                max_applications: 0,
                max_positions: 0,
                job_type: "Full time",
                duration: 0,
                monthly_salary: 0,
                skill_set: '',
                deadline: new Date()
              });
            } else {
                if(!validator.isInt(req.monthly_salary + '', {min: 1})){
                  alert("Monthly salary MUST be a positive integer");
      window.location.href = "/add_job_listing";

                  this.setState({
                    title: '',
                    max_applications: 0,
                    max_positions: 0,
                    job_type: "Full time",
                    duration: 0,
                    monthly_salary: 0,
                    skill_set: '',
                    deadline: new Date()
                  });
                } else {
                  console.log(req);

                  axios
                  .post("/listings/add", req)
                  .then((res) => {
                    alert("Job Added!");
                  window.location.href = "/add_job_listing";
                    console.log(res);
                  })
                  .catch((err) => {
                    if (err.response.data) alert(err.response.data);
                  window.location.href = "/add_job_listing";
                  });
                  
                  this.setState({
                    title: '',
                    max_applications: 0,
                    max_positions: 0,
                    job_type: "Full time",
                    duration: 0,
                    monthly_salary: 0,
                    skill_set: '',
                    deadline: new Date()
                  });
                }
            }
        }
      }
    }
  }
  //alert("Came here");
  //window.location.href = "/add_job_listing";
}


  render() {
    return (
      <div>
        <h3>Add new job listing here</h3>
        <Form onSubmit={this.onAddingJob}>
          <Form.Group controlId="formBasicTitle">
            <Form.Label>Title: </Form.Label>
            <Form.Control type="text" placeholder="Enter title"
             value={this.state.title} onChange={this.onChangeTitle} />
          </Form.Group>
          <br/>
          <br/>
          <Form.Group controlId="formBasicSkills">
            <Form.Label>Skills required: </Form.Label>
            <Form.Control type="text" placeholder="Enter skills"
             value={this.state.skill_set} onChange={this.onChangeSkill} />
          </Form.Group>
          <br/>
          <br/>

          <Form.Group controlId="formBasicCount">
            <Form.Label>Maximum number of applications that will be evaluated: </Form.Label>
            <Form.Control type="number" placeholder="Enter application count"
            value={this.state.max_applications} onChange={this.onChangeAppl} />
          </Form.Group>
          <br/>
          <br/>


          <Form.Group controlId="formBasicJobs">
            <Form.Label>Maximum number of job offerings: </Form.Label>
            <Form.Control type="number" placeholder="Enter job offerings count"
            value={this.state.max_positions} onChange={this.onChangePos} />
          </Form.Group>
          <br/>
          <br/>

          <Form.Group controlId="exampleForm.ControlSelect1">
            <Form.Label>Job type: </Form.Label>
              <Form.Control
              as="select"
              onChange={this.onChangeJobType}
              value={this.state.job_type}
              inputRef={(el) => (this.inputEl = el)}
              >
              <option value="Full time">Full time</option>
              <option value="Part time">Part time</option>
              <option value="Work from home">Work from home</option>
              </Form.Control>
              <br></br>
              <br></br>
          </Form.Group>

          <Form.Group controlId="exampleForm.ControlSelect1">
            <Form.Label>Select duration in months</Form.Label>
              <Form.Control
              as="select" value={this.state.duration}
              onChange={this.onChangeDuration}
              inputRef={(el) => (this.inputEl = el)}
              >
              <option value="0">0</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              </Form.Control>
              <br></br>
              <br></br>
        </Form.Group>

          <Form.Group controlId="formBasicSalary">
            <Form.Label>Monthly salary: </Form.Label>
            <Form.Control type="number" placeholder="Enter salary"
            value={this.state.monthly_salary} onChange={this.onChangeSalary} />
          </Form.Group>
          <br/>
          <br/>
          <MDBContainer>
            <MDBRow>
              <MDBCol>
                <TextField
                  id="datetime-local"
                  label="Add deadline"
                  type="datetime-local"
                  onChange={this.onChangeDeadline}
                  defaultValue={this.dateFormat(this.state.deadline)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </MDBCol>
            </MDBRow>
          </MDBContainer>
          <br/>
          <br/>
          
          <Button variant="primary" type="submit">
            Add job listing
          </Button>
          <br/>
          <br/>
        </Form>
      </div>
    );
  }
}
