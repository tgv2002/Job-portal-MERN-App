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

export default class JobListings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      job_listings: []
    };

    this.displayDate = this.displayDate.bind(this);
    this.displayDateBrief = this.displayDateBrief.bind(this);
    this.onDeletingJob = this.onDeletingJob.bind(this);
  }

  componentDidMount() {
    axios.get("/listings/all/" + localStorage.getItem("id"))
    .then(res => this.setState({ job_listings: res.data }));
  }

  onDeletingJob(job) {

    var req = {
      job_id: job._id,
    };

    axios.delete("/listings/delete/" + job._id, req)
    .then((res) => {})
    .catch((err) => {
      if (err.response.data) alert(err.response.data);
    });
    window.location.href = "/rec_job_listings";
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
        return (
            <div>
              <table class="table table-striped table-dark">
                    <thead>
                    <tr>
                        <th>Job Title</th>
                        <th>Job Rating</th>
                        <th>Number Of Open Applications</th>
                        <th>Maximum Number of Applicants</th>
                        <th>Number Of Remaining Positions</th>
                        <th>Maximum Number Of Positions</th>
                        <th>Deadline</th>
                        <th>Date of Posting</th>
                        <th>Edit job</th>
                        <th>Delete job</th>
                        <th>View Applications</th>
                        </tr>
                    </thead>
                    <tbody>
            {
            arg.state.job_listings
            .map((element, idx) => {
                return (
                    <tr>
                      <td>{element.title}</td>
                      <td>{(element.number_rated === 0) ? "Not rated" : (element.sum_rated/element.number_rated)}</td>
                      <td>{element.open_applications}</td>
                      <td>{element.max_applications}</td>
                      <td>{element.max_positions - element.accepted_applications}</td>
                      <td>{(element.max_positions)}</td>
                      <td>{arg.displayDate(element.deadline)}</td>
                      <td>{arg.displayDateBrief(element.date_of_posting)}</td>
                      <td>
                      <Link to={{ pathname: "/update_job", state: { element: element } }}>
                        <Button
                          variant="primary"
                          className="btn btn-primary"
                          value="update"
                        >
                          Update Job Details
                        </Button>
                      </Link>
                    </td>
                      <td>
                        <Button
                        variant="danger"
                        className="btn btn-primary"
                        value="delete_job"
                        onClick={() => arg.onDeletingJob(element)}
                        >
                        Delete Job
                        </Button>
                    </td>
                    <td>
                        <Link to={{ pathname: "/job_applications", state: { element: element } }}>
                          <Button
                            variant="warning"
                            className="btn btn-primary"
                            value="view_applications"
                          >
                          View Applications
                          </Button>
                        </Link>
                    </td>
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
        <h2>Job Listings: </h2>
        <div>{displayJobListings(this)}</div>
      </div>
    );
  }
}
