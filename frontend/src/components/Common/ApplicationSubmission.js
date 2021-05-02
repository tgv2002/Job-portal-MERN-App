import React, { Component } from "react";
import axios from "axios";
import "bootstrap/dist/js/bootstrap.bundle";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap";
var validator = require('validator');

export default class UpdateJobForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cur_job: this.props.location.state.cur_job,
            sop_val: ""
        };

        this.onChangeSop = this.onChangeSop.bind(this);
        this.onClickingApply = this.onClickingApply.bind(this);
    }

    onChangeSop(e){
        this.setState({sop_val: e.target.value});
    }

    onClickingApply(e, element){
        e.preventDefault();
        //console.log("on click apply");
        var req = {
            sop: this.state.sop_val,
            applicant_id: localStorage.getItem("id"),
            recruiter_id: element.recruiter_id,
            listing_id: element._id,
            date_of_applying: new Date(),
            stage_of_application: "Applied"
        };

        if(validator.isAfter((this.state.cur_job.deadline) + '')){
          if(req.sop.split(/\s+/).length > 250){
            alert("SOP SHOULD NOT HAVE MORE THAN 250 WORDS");
          window.location.href = "/job_listings";
          } else {
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
        } else {
          alert("Deadline reached, application submission failed");
          window.location.href = "/job_listings";
        }
    }

      render(){
          return(
            <div>
                <h2><strong>APPLICATION SUBMISSION FORM</strong></h2>
                <br/>
                <br/>
                <br/>
                <Form onSubmit={e => this.onClickingApply(e, this.state.cur_job)}>
                    <Form.Group controlId="formBasicSOP">
                    <Form.Label><strong>SOP (in not more than 250 words): </strong></Form.Label>
                    <Form.Control type="text" onChange={this.onChangeSop}
                    value={this.state.sop_val}
                    />
                    </Form.Group>
                    <br/>
                    <br/>
                    <Button variant="primary" type="submit">
                    Submit Application
                    </Button>
                    <br/>
                    <br/>
                </Form>
            </div>
          );
      }
}