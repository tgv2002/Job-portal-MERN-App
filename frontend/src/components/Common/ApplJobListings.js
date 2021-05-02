import React, { Component } from "react";
import axios from "axios";
import "bootstrap/dist/js/bootstrap.bundle";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap";
import Fuse from 'fuse.js';
var validator = require('validator');

const options = {
  findAllMatches: true,
  includeMatches: false,
  keys: [
    "title"
  ]
};

const month_names = ["January", "February", "March", "April",
                  "May", "June", "July", "August", "September",
                  "October","November","December"];

export default class JobListings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      job_listings: [],
      all_job_listings: [],
     // sortSalary: "Ascending",
      //sortDuration: "Ascending",
      // sortRating: "Ascending",
      jobType: "Full time",
      salary_x: 0,
      salary_y: 1000000000,
      dur: 0,
      pattern: "",
      myApplications: [],
      but_click: "",
      sop: ""
    };

    this.sortBySalary = this.sortBySalary.bind(this);
    this.filterByDuration = this.filterByDuration.bind(this);
    this.sortByDuration = this.sortByDuration.bind(this);
    this.sortByRating = this.sortByRating.bind(this);
    this.filterByJobType = this.filterByJobType.bind(this);
    this.onClickingApply = this.onClickingApply.bind(this);
    this.onSearchingJob = this.onSearchingJob.bind(this);
    this.getForm = this.getForm.bind(this);
    this.getAllJobs = this.getAllJobs.bind(this);
    this.displayButton = this.displayButton.bind(this);
    this.displayDate = this.displayDate.bind(this);
    this.displayDateBrief = this.displayDateBrief.bind(this);
    this.onChangeSop = this.onChangeSop.bind(this);
    this.onChangePattern = this.onChangePattern.bind(this);
    this.accessItem = this.accessItem.bind(this);
  }

  onChangePattern(e){
    this.setState({pattern: e.target.value});
  }

  componentDidMount() {
    axios.get("/listings/")
    .then(res => this.setState({ job_listings: res.data, all_job_listings: res.data }));
    axios.get("/application/user/" + localStorage.getItem("id"))
    .then(res => this.setState({ myApplications: res.data }));
  }

  getAllJobs(){
    this.setState({
      job_listings: this.state.all_job_listings,
      jobType: "Full time",
      salary_x: 0,
      salary_y: 1000000000,
      dur: 0
    });
  }

  onChangeSop(e){
    this.setState({sop: e.target.value});
  }

  onClickingApply(e, element){
    e.preventDefault();
    //console.log("on click apply");
    var req = {
        sop: this.state.sop,
        applicant_id: localStorage.getItem("id"),
        recruiter_id: element.recruiter_id,
        listing_id: element._id,
        date_of_applying: new Date(),
        stage_of_application: "Applied"
    };

    axios
      .post("/application/add/", req)
      .then((res) => {
        console.log(res);
    window.location.href = "/job_listings";
      })
      .catch((err) => {
        if (err.response.data) alert(err.response.data);
    window.location.href = "/job_listings";
      });
  }

  onChangeSalaryLower = (e) => {
      this.setState({salary_x: document.getElementById("bt3").value});
  }


  onChangeSalaryUpper = (e) => {
    this.setState({salary_y: document.getElementById("bt4").value});
  }

  filterBySalaryBounds = (e) => {
    e.preventDefault();
    //console.log("Filter salary");
    this.setState({
      job_listings: this.state.job_listings
      .filter(job => job.monthly_salary >= this.state.salary_x &&
              job.monthly_salary <= this.state.salary_y)
    });
  }

  accessItem(fuse_dir){
    let job_lis = [];
    for(let i=0;i<fuse_dir.length;i++){
      job_lis.push(fuse_dir[i].item);
    }
    return job_lis;
  }

  onSearchingJob(e){
    //console.log("Searchhhh");
    if(!e.target.value){
      this.setState({job_listings: this.state.all_job_listings});
      return;
    }
    const fuse = new Fuse(this.state.job_listings, options);
    this.setState({job_listings: this.accessItem(fuse.search(e.target.value))});
   // console.log(this.state.job_listings);
  }

  filterByDuration(e){
    //console.log("Filter job duration");
    var val = parseInt(e.target.value);
    this.setState({
      job_listings: this.state.job_listings
      .filter(job => job.duration >= 0 &&
              job.duration < val)
    });
  }

  filterByJobType(e){
    //console.log("Filter job type");
    var req_type = e.target.value;
    this.setState({
      job_listings: this.state.job_listings.filter(job => job.job_type === req_type)
    });
  }

  sortBySalary(flag){
      var array = this.state.job_listings;
      //console.log("Salary sort");
      //var flag = ((e.target.value === "Descending") ? 0 : 1);
      array.sort(function(a, b) {
          if(a.monthly_salary !== undefined && b.monthly_salary !== undefined){
              return (1 - (flag*2)) * (a.monthly_salary - b.monthly_salary);
          }
          else{
              return 1;
          }
        });
      this.setState({
          job_listings: array,
          //sortSalary: (e.target.value === "Descending") ? "Ascending" : "Descending"
      });
      //console.log(this.state.job_listings);
      //console.log(this.state.sortSalary);
  }

  sortByDuration(flag){
    var array = this.state.job_listings;
    //console.log("Duration sort");
    //var flag = ((e.target.value === "Descending") ? 0 : 1);
    array.sort(function(a, b) {
        if(a.duration !== undefined && b.duration !== undefined){
            return (1 - (flag*2)) * (a.duration - b.duration);
        }
        else{
            return 1;
        }
      });
    this.setState({
        job_listings: array,
        //sortDuration: (e.target.value === "Descending") ? "Ascending" : "Descending"
    });
}

sortByRating(flag){
  var array = this.state.job_listings;
  //console.log("Rating sort");
  //var flag = ((e.target.value === "Descending") ? 0 : 1);
  array.sort(function(a, b) {
      var val1 = (a.number_rated === 0) ? 0 : (a.sum_rated/a.number_rated);
      var val2 = (b.number_rated === 0) ? 0 : (b.sum_rated/b.number_rated);
      return (1 - (flag*2)) * (val1 - val2);
    });
  this.setState({
      job_listings: array,
      //sortRating: (e.target.value === "Descending") ? "Ascending" : "Descending"
  });
}

getForm(element){
  return(
    <div>
      <Form onSubmit={e => this.onClickingApply(e, element)}>
        <Form.Group controlId="formBasicSOP">
          <Form.Label>SOP: </Form.Label>
          <Form.Control id="sopp" type="text" onChange={this.onChangeSop}
          placeholder="Enter SOP here (in atmost 250 words)"
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit Application
        </Button>
      </Form>
    </div>
  );
}

displayButton(cur_job){
  for(let i=0;i<this.state.myApplications.length;i++){
    if(cur_job._id === this.state.myApplications[i].listing_id){
      return(
        <td>
          <Button 
          variant="warning"
          value="applied">
            Applied
          </Button>
        </td>
      );
    }
  }
  if(cur_job.max_applications === cur_job.open_applications
    || cur_job.accepted_applications === cur_job.max_positions){
      return(
        <td>
          <Button 
          variant="secondary"
          value="full">
            Full
          </Button>
        </td>
      );
    }
  return(
      <div>
        <Link to={{ pathname: "/application_sub", state: { cur_job: cur_job } }}>
        <Button
          variant="primary"
          className="btn btn-primary"
          value="apply"
        >
        Apply
        </Button>
        </Link>
      </div>
    );
}

displayDate(dateValue) {
  var dateVal = new Date(dateValue);
  var s1 = dateVal.getDate();
  var s2 = " ";
  var s3 = month_names[dateVal.getMonth()];
  var s4 = ",";
  var s5 = dateVal.getFullYear();
  var s6 = " - ";
  var s7 = dateVal.getHours();
  var s8 = ":"
  var s9 = dateVal.getMinutes();
  return (s1 + s2 + s3 + s4 + s5 + s6 + s7 + s8 + s9);
}

displayDateBrief(dateVAll) {
  var dateVAl = new Date(dateVAll);
  var s1 = dateVAl.getDate();
  var s2 = " ";
  var s3 = month_names[dateVAl.getMonth()];
  var s4 = ",";
  var s5 = dateVAl.getFullYear();
  return (s1 + s2 + s3 + s4 + s5);
}

render() {
    function displayJobListings(arg) {
      if (arg.state.job_listings.length === 0) {
        return (
          <div>
            <p>No jobs to display</p>
          </div>
        );
      } else {
        console.log(arg.state.job_listings);
        return (
            <div>
              <table class="table table-striped table-dark">
                    <thead>
                    <tr>
                        <th>Job Title</th>
                        <th>Job Type</th>
                        <th>Job Rating</th>
                        <th>Skillset required</th>
                        <th>Duration</th>
                        <th>Monthly Salary</th>
                        <th>Recruiter Name</th>
                        <th>Recruiter Email</th>
                        <th>Deadline</th>
                        <th>Date of Posting</th>
                        <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
            {
            arg.state.job_listings
            .filter(job => job.status === "Active")
            .map((element, idx) => {
                return (
                    <tr>
                      <td>{element.title}</td>
                      <td>{element.job_type}</td>
                      <td>{(element.number_rated === 0) ? "Not rated" : (element.sum_rated/element.number_rated)}</td>
                      <td>{element.skill_set}</td>
                      <td>{(element.duration === 0) ? "Not mentioned" : element.duration}</td>
                      <td>{element.monthly_salary}</td>
                      <td>{element.recruiter_name}</td>
                      <td>{element.recruiter_email}</td>
                      <td>{arg.displayDate(element.deadline)}</td>
                      <td>{arg.displayDateBrief(element.date_of_posting)}</td>
                      <td>{arg.displayButton(element)}</td>
                    </tr>
                );
            })}
                    </tbody>
                </table>
            </div>
          );    
       }
    }

    return (
      <div>
        <div class="col-md-6 mb-4">
          <input class="form-control" type="text" 
          placeholder="Search" aria-label="Search"
          onChange={this.onSearchingJob}/>
        </div>
        <br></br>
        <br></br>
        <br></br>

            <Form.Group>
                <Form.Label>Sort based on monthly salary: </Form.Label>
                <br/>
                <>
                  <Button variant="success"
                  onClick={() => this.sortBySalary(0)}>
                    Ascending order
                    </Button>{' '}
                  <Button variant="danger"
                  onClick={() => this.sortBySalary(1)}>
                    Descending order
                    </Button>{' '}
                </>
            </Form.Group>
              <br></br>
              <br></br>

              <Form.Group>
                <Form.Label>Sort based on Rating: </Form.Label>
                <br/>
                <>
                  <Button variant="success"
                  onClick={() => this.sortByRating(0)}>
                    Ascending order
                    </Button>{' '}
                  <Button variant="danger"
                  onClick={() => this.sortByRating(1)}>
                    Descending order
                    </Button>{' '}
                </>
            </Form.Group>
              <br></br>
              <br></br>

              <Form.Group>
                <Form.Label>Sort based on Duration: </Form.Label>
                <br/>

                <>
                  <Button variant="success"
                  onClick={() => this.sortByDuration(0)}>
                    Ascending order
                    </Button>{' '}
                  <Button variant="danger"
                  onClick={() => this.sortByDuration(1)}>
                    Descending order
                    </Button>{' '}
                </>
            </Form.Group>
              <br></br>
              <br></br>

          <br></br>
        <Form.Group controlId="exampleForm.ControlSelect1">
            <Form.Label>Filter by Job type</Form.Label>
              <Form.Control
              as="select"
              onChange={this.filterByJobType}
              inputRef={(el) => (this.inputEl = el)}
              >
              <option value="Full time">Full time</option>
              <option value="Part time">Part time</option>
              <option value="Work from home">Work from home</option>
              </Form.Control>
              <br></br>
              <br></br>
        </Form.Group>
        
        <Form onSubmit={this.filterBySalaryBounds}>
          <div class="form-group">
          <label for="Salary lower bound">Salary lower bound:</label>
              <input id="bt3" type="number" class="form-control"
              name="salary_x" value={this.state.salary_x} 
              min="0" max="1000000000" onChange={this.onChangeSalaryLower}
              placeholder="Salary lower bound" />
          </div>
          <div class="form-group">
          <label for="Salary upper bound">Salary upper bound:</label>
              <input id="bt4" type="number" class="form-control"
              name="salary_y" value={this.state.salary_y} 
              min="0" max="1000000000" onChange={this.onChangeSalaryUpper}
              placeholder="Salary upper bound" />
          </div>
          <br/>
          <Button variant="primary" type="submit">
            Filter by Salary
          </Button>
        </Form>
        <br></br>
          <br></br>
          <br></br>
        <Form.Group controlId="exampleForm.ControlSelect1">
            <Form.Label>Filter by duration</Form.Label>
              <Form.Control
              as="select"
              onChange={this.filterByDuration}
              inputRef={(el) => (this.inputEl = el)}
              >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              </Form.Control>
              <br></br>
              <br></br>
        </Form.Group>
        <p>NOTE: Click on the below button if you want to discard all previously applied filter operations</p>
        <Button
          variant="warning"
          className="btn btn-primary"
          value="retrieve"
          onClick={() => this.getAllJobs()}
        >
        Retrieve All jobs (Remove all filters)
        </Button>
        <br></br>
          <br></br>
          <br></br>
          <br></br>
        <h2>Active Job Listings: </h2>
        <div>{displayJobListings(this)}</div>
      </div>
    );
  }
}
