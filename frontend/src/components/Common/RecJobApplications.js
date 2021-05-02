import React, { Component } from "react";
import axios from "axios";
import "bootstrap/dist/js/bootstrap.bundle";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
/*import { Card, CardImg, CardText, CardBody,
  CardTitle, CardSubtitle, Button } from 'react-bootstrap-card';*/
import Card from "react-bootstrap/Card";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap";
var validator = require('validator');

const month_names = ["January", "February", "March", "April",
                  "May", "June", "July", "August", "September",
                  "October","November","December"];

export default class JobApplications extends Component {
  constructor(props) {
    super(props);

    this.state = {
      element: this.props.location.state.element,
      applications_list: [],
      //sortName: "Ascending",
      //sortDate: "Ascending",
      //sortRating: "Ascending"
    };

    this.sortByName = this.sortByName.bind(this);
    this.sortByDate = this.sortByDate.bind(this);
    this.sortByRating = this.sortByRating.bind(this);
    this.displayDateBrief = this.displayDateBrief.bind(this);
    this.displaySkills = this.displaySkills.bind(this);
    this.statusButtons = this.statusButtons.bind(this);
    this.onAccepting = this.onAccepting.bind(this);
    this.onShortListing = this.onShortListing.bind(this);
    this.onRejecting = this.onRejecting.bind(this);
  }

  componentDidMount() {
    
    axios.get("/application/details/" + this.state.element._id)
    .then(res => this.setState({ applications_list: res.data }));
  }

  onAccepting(e){
    var req = {
      applicant_id: e.applicant_id,
      listing_id: e.listing_id,
      rec_id: localStorage.getItem("id"),
      stage_of_application: "Accepted"
    }

    axios
      .post("/application/update/status/" + e._id, req)
      .then((res) => {
        console.log(res);
    window.location.href = "/job_applications";

      })
      .catch((err) => {
        if (err.response.data) alert(err.response.data);
    window.location.href = "/job_applications";

      });
  }

  onRejecting(e){
    var req = {
      applicant_id: e.applicant_id,
      listing_id: e.listing_id,
      rec_id: localStorage.getItem("id"),
      stage_of_application: "Rejected"
    }

   // alert("Reject time");

    axios
      .post("/application/update/status/" + e._id, req)
      .then((res) => {
        console.log(res);
    window.location.href = "/job_applications";

      })
      .catch((err) => {
        if (err.response.data) alert(err.response.data);
    window.location.href = "/job_applications";
      });
  }

  onShortListing(e){
    var req = {
      applicant_id: e.applicant_id,
      listing_id: e.listing_id,
      rec_id: localStorage.getItem("id"),
      stage_of_application: "Shortlisted"
    }

    axios
      .post("/application/update/status/" + e._id, req)
      .then((res) => {
        console.log(res);
    window.location.href = "/job_applications";

      })
      .catch((err) => {
        if (err.response.data) alert(err.response.data);
    window.location.href = "/job_applications";
      });
  }

  statusButtons(e){
    if(e.stage_of_application === "Accepted"){
      return(
        <div>
          <Button 
            variant="success"
            value="accepted">
              Accepted!
          </Button>
        </div>
      );
    } else if(e.stage_of_application === "Shortlisted"){
      return(
      <div>
          <Button
            variant="primary"
            className="btn btn-primary"
            value="accept"
            onClick={() => this.onAccepting(e)}
          >
          Accept
          </Button>
          <Button
            variant="danger"
            className="btn btn-primary"
            value="reject"
            onClick={() => this.onRejecting(e)}
          >
          Reject
          </Button>
        </div>
      );
    } else {
      return(
      <div>
          <Button
            variant="warning"
            className="btn btn-primary"
            value="shortlist"
            onClick={() => this.onShortListing(e)}
          >
          Shortlist
          </Button>
          <Button
            variant="danger"
            className="btn btn-primary"
            value="reject"
            onClick={() => this.onRejecting(e)}
          >
          Reject
          </Button>
        </div>
      );
    }
  }

  sortByName(flag){
      var array = this.state.applications_list;
      //var flag = ((e.target.value === "Descending") ? 0 : 1);
      array.sort(function(a, b) {
          if(a.user.name !== undefined && b.user.name !== undefined){
            return ((1 - (flag*2)) * (("" + a.user.name).localeCompare(b.user.name)));
          }
          else{
              return 1;
          }
        });
      this.setState({
          applications_list: array,
         // sortName: (e.target.value === "Descending") ? "Ascending" : "Descending"
      });
  }

  sortByDate(flag){
    var array = this.state.applications_list;
    //var flag = ((e.target.value === "Descending") ? 0 : 1);
    array.sort(function(a, b) {
        if(a.application.date_of_applying !== undefined && b.application.date_of_applying !== undefined){
              let val = ((new Date(a.application.date_of_applying) > new Date(b.application.date_of_applying)) ? 1 : -1);
              if(new Date(a.application.date_of_applying) === new Date(b.application.date_of_applying)) val = 0;
            return (1 - (flag*2)) * (val);
        }
        else{
            return 1;
        }
      });
    this.setState({
        applications_list: array,
        //sortDate: (e.target.value === "Descending") ? "Ascending" : "Descending"
    });
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

sortByRating(flag){
  var array = this.state.applications_list;
  //var flag = ((e.target.value === "Descending") ? 0 : 1);
  array.sort(function(a, b) {
      var a_rat = (a.user.number_rated === 0) ? 0 : (a.user.sum_rated/a.user.number_rated);
      var b_rat = (b.user.number_rated === 0) ? 0 : (b.user.sum_rated/b.user.number_rated);
      return (1 - (flag*2)) * (a_rat - b_rat);
    });
  this.setState({
      applications_list: array,
      //sortRating: (e.target.value === "Descending") ? "Ascending" : "Descending"
  });
}

displaySkills(e){
  var conc_skills = "";
  if(e){
    for(let i=0;i<e.length;i++){
      if(i !== (e.length - 1))
        conc_skills = (conc_skills + e[i].skill + ", ");
      else 
      conc_skills = (conc_skills + e[i].skill);
    }
  } 
  return conc_skills;
}

  render() {

    function displayApplicationsList(arg) {
      if (arg.state.applications_list.length === 0) {
        return (
          <div>
            <p>No applications to display</p>
          </div>
        );
      } else {
        return (
            <div>
            {
            arg.state.applications_list
            .filter(applic => applic.application.stage_of_application !== "Rejected" &&
                              applic.application.stage_of_application !== "Deleted")
            .map((element, idx) => {
                return (
                <div>
                    <br></br>
                    <br></br>
                    <Card bg = "info" text = "white">
                      <Card.Header><h3>Applicant Name: {element.user.name}</h3></Card.Header>
                      <Card.Body>
                        <Card.Title><h3>Applicant Rating: </h3></Card.Title>
                        <Card.Text>
                          {(element.user.number_rated === 0) ? 0 : (element.user.sum_rated/element.user.number_rated)}
                        </Card.Text>
                        <Card.Title><h3>SOP: </h3></Card.Title>
                        <Card.Text>
                          {element.application.sop}
                        </Card.Text>
                        <Card.Title><h3>Skills: </h3></Card.Title>
                        <Card.Text>
                          {arg.displaySkills(element.skills)}
                        </Card.Text>
                        <Card.Title><h3>Date of Application: </h3></Card.Title>
                        <Card.Text>
                          {arg.displayDateBrief(element.application.date_of_applying)}
                        </Card.Text>
                        <Card.Title><h3>Education Details: </h3></Card.Title>
                        <Card.Text>
                        {
                            element.education_details.map((ed, ind) => {
                              return(
                                <div>
                                  <p>Institute: {ed.institute_name}</p>
                                  <p>Start Year: {ed.start_year}</p>
                                  <p>End Year: {(ed.end_year === 0) ? "Not mentioned" : ed.end_year}</p>
                                </div>
                              );
                            })
                        }
                        </Card.Text>
                        <Card.Title><h3>Stage of Application: </h3></Card.Title>
                        <Card.Text>
                          {element.application.stage_of_application}
                        </Card.Text>
                        {arg.statusButtons(element.application)}
                      </Card.Body>
                    </Card>
                    <br/>
                </div>
                );
            })}
            </div>
          );    
       }
    }

    return (
      <div>
        <Form.Group>
                <Form.Label>Sort based on Applicant Name: </Form.Label>
                <br/>
                <>
                  <Button variant="success"
                  onClick={() => this.sortByName(0)}>
                    Ascending order
                    </Button>{' '}
                  <Button variant="danger"
                  onClick={() => this.sortByName(1)}>
                    Descending order
                    </Button>{' '}
                </>
            </Form.Group>
              <br></br>
              <br></br>

              <Form.Group>
                <Form.Label>Sort based on Applicant Rating: </Form.Label>
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
                <Form.Label>Sort based on Date of Application: </Form.Label>
                <br/>
                <>
                  <Button variant="success"
                  onClick={() => this.sortByDate(0)}>
                    Ascending order
                    </Button>{' '}
                  <Button variant="danger"
                  onClick={() => this.sortByDate(1)}>
                    Descending order
                    </Button>{' '}
                </>
            </Form.Group>
              <br></br>
              <br></br>
              <br></br>
        <h3>Applications: </h3>
        <div>{displayApplicationsList(this)}</div>
      </div>
    );
  }
}
