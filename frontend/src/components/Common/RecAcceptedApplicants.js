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

export default class AcceptedApplicants extends Component {
  constructor(props) {
    super(props);

    this.state = {
      myApplicants: [],
      rate_this: "",
      //sortName: "Ascending",
      //sortTitle: "Ascending",
      //sortDate: "Ascending",
      //sortRating: "Ascending"
    };

    this.onRatingApplicant = this.onRatingApplicant.bind(this);
    this.rateHere = this.rateHere.bind(this);
    this.displayButton = this.displayButton.bind(this);
    this.sortByName = this.sortByName.bind(this);
    this.sortByTitle = this.sortByTitle.bind(this);
    this.sortByDate = this.sortByDate.bind(this);
    this.sortByRating = this.sortByRating.bind(this);
    this.displayDateBrief = this.displayDateBrief.bind(this);
  }

  sortByName(flag){
    var array = this.state.myApplicants;
    //var flag = ((e.target.value === "Descending") ? 0 : 1);
    array.sort(function(a, b) {
        if(a.applicant_name !== undefined && b.applicant_name !== undefined){
            return ((1 - (flag*2)) * (("" + a.applicant_name).localeCompare(b.applicant_name)));
        }
        else{
            return 1;
        }
      });
    this.setState({
        myApplicants: array,
        //sortName: (e.target.value === "Descending") ? "Ascending" : "Descending"
    });
}

sortByTitle(flag){
    var array = this.state.myApplicants;
    //var flag = ((e.target.value === "Descending") ? 0 : 1);
    array.sort(function(a, b) {
        if(a.title !== undefined && b.title !== undefined){
          return ((1 - (flag*2)) * (("" + a.title).localeCompare(b.title)));
        }
        else{
            return 1;
        }
      });
    this.setState({
        myApplicants: array,
        //sortTitle: (e.target.value === "Descending") ? "Ascending" : "Descending"
    });
}

sortByDate(flag){
  var array = this.state.myApplicants;
  //var flag = ((e.target.value === "Descending") ? 0 : 1);
  array.sort(function(a, b) {
      if(a.joining_date !== undefined && b.joining_date !== undefined){
            let val = ((new Date(a.joining_date) > new Date(b.joining_date)) ? 1 : -1);
            if(new Date(a.joining_date) === new Date(b.joining_date)) val = 0;
          return (1 - (flag*2)) * (val);
      }
      else{
          return 1;
      }
    });
  this.setState({
      myApplicants: array,
      //sortDate: (e.target.value === "Descending") ? "Ascending" : "Descending"
  });
}

sortByRating(flag){
  var array = this.state.myApplicants;
  //var flag = ((e.target.value === "Descending") ? 0 : 1);
  array.sort(function(a, b) {
      if(a.applicant_rating !== undefined && b.applicant_rating !== undefined){
          return (1 - (flag*2)) * (a.applicant_rating - b.applicant_rating);
      }
      else{
          return 1;
      }
    });
  this.setState({
      myApplicants: array,
      //sortRating: (e.target.value === "Descending") ? "Ascending" : "Descending"
  });
}

  rateHere(e){
      this.setState({rate_this: e._id});
  }

  componentDidMount() {
    axios.get("/user/accepted_applicants/" + localStorage.getItem("id"))
    .then(res => this.setState({ myApplicants: res.data }));
  }

  onRatingApplicant(e){
        var rating = (window.prompt("Enter employee rating here (Valid range is 0-5): "));
        if(!rating) rating = '';

        if(!validator.isInt(rating + '', {min: 0, max: 5})){
          alert("Rating value should be an integer which is atleast 0 and atmost 5");
          window.location.href = "/acc_applicants";
        } else {
          var req = {
            rating: parseInt(rating),
            listing_id: e.listing_id
            };
          axios
          .post("/user/profile/rating/" + e.applicant_id, req)
          .then((res) => {
              console.log(res);
              window.location.href = "/acc_applicants";
          })
          .catch((err) => {
              if (err.response.data) alert(err.response.data);
              window.location.href = "/acc_applicants";
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

      //console.log(e.rated_applicant);

      if(e.rated_applicant){
          return(
              <div>
              <Button
                variant="warning"
                className="btn btn-primary"
                value="rate"
              >
              Rated
              </Button>
              </div>
          );
      } else{
        return(
            <div>
              <Button
                variant="primary"
                className="btn btn-primary"
                value="rate"
                onClick={() => this.onRatingApplicant(e)}
              >
              Rate Employee
              </Button>
            </div>
          );
      }
  }

  render() {

    function displayApplicationsList(arg) {
      if (arg.state.myApplicants.length === 0) {
        return (
          <div>
            <p>No Employees to display</p>
          </div>
        );
      } else {
        return (
            <div>
                <table class="table table-striped table-dark">
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Date of Joining</th>
                        <th>Job Type</th>
                        <th>Job Title</th>
                        <th>Employee Rating</th>
                        <th>Rating Status</th>
                        </tr>
                    </thead>
                    <tbody>
                    {
                    arg.state.myApplicants
                    .map((element, idx) => {
                        return (
                            <tr>
                                <td>{element.applicant_name}</td>
                                <td>{arg.displayDateBrief(element.joining_date)}</td>
                                <td>{element.jobType}</td>
                                <td>{element.title}</td>
                                <td>{element.applicant_rating}</td>
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
            <Form.Group>
                <Form.Label>Sort based on Employee Name: </Form.Label>
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
                <Form.Label>Sort based on Job Title: </Form.Label>
                <br/>
                <>
                  <Button variant="success"
                  onClick={() => this.sortByTitle(0)}>
                    Ascending order
                    </Button>{' '}
                  <Button variant="danger"
                  onClick={() => this.sortByTitle(1)}>
                    Descending order
                    </Button>{' '}
                </>
            </Form.Group>
              <br></br>
              <br></br>

              <Form.Group>
                <Form.Label>Sort based on Employee Rating: </Form.Label>
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
                <Form.Label>Sort based on Date of Joining: </Form.Label>
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
        <h2>My Employees: </h2>
        <div>{displayApplicationsList(this)}</div>
      </div>
    );
  }
}
