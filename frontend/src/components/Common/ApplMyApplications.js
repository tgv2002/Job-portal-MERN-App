import React, { Component } from "react";
import axios from "axios";
import "bootstrap/dist/js/bootstrap.bundle";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap";
var validator = require('validator');

const month_names = ["January", "February", "March", "April",
                  "May", "June", "July", "August", "September",
                  "October","November","December"];

export default class MyApplications extends Component {
  constructor(props) {
    super(props);

    this.state = {
      myApplications: [],
      rate_this: ""
    };

    this.onRatingJob = this.onRatingJob.bind(this);
    this.rateHere = this.rateHere.bind(this);
    this.displayButton = this.displayButton.bind(this);
    this.displayDateBrief = this.displayDateBrief.bind(this);
  }

  rateHere(e){
      this.setState({rate_this: e._id});
  }

  componentDidMount() {
    axios.get("/application/user/" + localStorage.getItem("id"))
    .then(res => this.setState({ myApplications: res.data }));
  }

  onRatingJob(e){
        var rating = (window.prompt("Enter job rating here (Valid Range is 0-5): "));
        if(!rating) rating = '';

        if(!validator.isInt(rating + '', {min: 0, max: 5})){
          alert("Rating value should be an integer which is atleast 0 and atmost 5");
          window.location.href = "/my_applications";
        } else {
          var req = {
            rating: parseInt(rating),
            applicant_id: e.applicant_id
            };

          axios
          .post("/listings/rating/" + e.listing_id, req)
          .then((res) => {
              console.log(res);
          window.location.href = "/my_applications";
          })
          .catch((err) => {
              if (err.response.data) alert(err.response.data);
          window.location.href = "/my_applications";
          });
        }
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

  displayButton(e){
      if(e.stage_of_application !== "Accepted"){
          return(
              <div>
               <p>Cannot rate job</p> 
              </div>
          );
      }
      if(e.rated_job){
          return(
              <div>
                  <p>You rated this job</p>
              </div>
          );
      } else {
        return(
            <div>
              <Button
                variant="primary"
                className="btn btn-primary"
                value="rate"
                onClick={() => this.onRatingJob(e)}
              >
              Rate Job
              </Button>
            </div>
          );
      }
  }

  render() {

    function displayApplicationsList(arg) {
      if (arg.state.myApplications.length === 0) {
        return (
          <div>
            <p>No applications to display</p>
          </div>
        );
      } else {
        return (
            <div>
                <table class="table table-striped table-dark">
                    <thead>
                    <tr>
                        <th>Job Title</th>
                        <th>Recruiter Name</th>
                        <th>Monthly Salary</th>
                        <th>Date of Joining</th>
                        <th>Job Status</th>
                        <th>Rating Status</th>
                        </tr>
                    </thead>
                    <tbody>
                    {
                    arg.state.myApplications
                    .filter(applic => applic.stage_of_application !== "Deleted")
                    .map((element, idx) => {
                        return (
                            <tr>
                                <td>{element.title}</td>
                                <td>{element.recruiter_name}</td>
                                <td>{element.monthly_salary}</td>
                                <td>{(element.stage_of_application === "Accepted") ? (arg.displayDateBrief(element.joining_date)) : "N/A"}</td>
                                <td>{element.stage_of_application}</td>
                                {arg.displayButton(element)}
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
        <h2>My Applications: </h2>
        <div>{displayApplicationsList(this)}</div>
      </div>
    );
  }
}
