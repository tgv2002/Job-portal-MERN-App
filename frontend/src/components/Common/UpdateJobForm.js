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


export default class UpdateJobForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            element: this.props.location.state.element,
            dedline: this.props.location.state.element.deadline,
            max_pos: this.props.location.state.element.max_positions,
            max_appls: this.props.location.state.element.max_applications
        };
        this.onEditingAppl = this.onEditingAppl.bind(this);
        this.onEditingPos = this.onEditingPos.bind(this);
        this.onEditingDeadline = this.onEditingDeadline.bind(this);
        this.onSubmitForm = this.onSubmitForm.bind(this);
        this.dateFormat = this.dateFormat.bind(this);
        this.onChangeDedLine = this.onChangeDedLine.bind(this);
        this.onChangeMaxPos = this.onChangeMaxPos.bind(this);
        this.onChangeMaxAppls = this.onChangeMaxAppls.bind(this);
    }

    dateFormat(deadline_value) {
        return date.format(new Date(deadline_value), "YYYY-MM-DD[T]HH:mm");
    }

    onSubmitForm(e){
        e.preventDefault();
        window.location.href = "/rec_job_listings";
    }

    onEditingAppl(e){
      e.preventDefault();
        var req = {
          max_applications: this.state.max_appls
        };
        
        if(validator.isInt(req.max_applications + '', {min: 1})){
        axios
        .post("/listings/update/applicants/" + this.state.element._id, req)
        .then((res) => {
          console.log(res);
        window.location.href = "/update_job";

        })
        .catch((err) => {
          if (err.response.data) alert(err.response.data);
        window.location.href = "/update_job";

        });
      } else {
        alert("Maximum appications should be a positive integer");
        window.location.href = "/update_job";
      }
    }
    
    onEditingPos(e){
      e.preventDefault();
        var req = {
          max_positions: this.state.max_pos
        };
        
        if(validator.isInt(req.max_positions + '', {min: 1})){
        axios
        .post("/listings/update/positions/" + this.state.element._id, req)
        .then((res) => {
          console.log(res);
      window.location.href = "/update_job";

        })
        .catch((err) => {
          if (err.response.data) alert(err.response.data);
      window.location.href = "/update_job";

        });
      } else {
        alert("Maximum positions should be a positive integer");
      window.location.href = "/update_job";

      }
    }
    
    onEditingDeadline(e){
       e.preventDefault();
        var req = {
          deadline: this.state.dedline
        };

       if(validator.isAfter((req.deadline) + '')){
        axios
        .post("/listings/update/deadline/" + this.state.element._id, req)
        .then((res) => {
          console.log(res);
        window.location.href = "/update_job";
        })
        .catch((err) => {
          if (err.response.data) alert(err.response.data);
        window.location.href = "/update_job";
        });
      } else {
        alert("Deadline cannot be before current date");
        window.location.href = "/update_job";
      }

      //console.log("REEEEEEEEEEEEEEEEEEEEEEEE");
        /*axios
        .post("/listings/update/deadline/" + this.state.element._id, req)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          if (err.response.data) alert(err.response.data);
        });
        window.location.href = "/update_job";*/
    }

      onChangeDedLine(e){
        this.setState({dedline: e.target.value});
      }

      onChangeMaxAppls(e){
        this.setState({max_appls: e.target.value});
      }

      onChangeMaxPos(e){
        this.setState({max_pos: e.target.value});
      }

      render(){
          return(
            <div>
                <Form onSubmit={this.onSubmitForm}>
                  <MDBContainer>
                      <MDBRow>
                        <MDBCol>
                        <Form onSubmit={this.onEditingDeadline} noValidate>
                              <TextField
                                id="datetime-locall"
                                label="Edit deadline for applying here"
                                type="datetime-local"
                                onChange={this.onChangeDedLine}
                                defaultValue={this.dateFormat(this.state.element.deadline)}
                                InputLabelProps={{
                                  shrink: true,
                                }}
                                />
                              <br/>
                              <br/>
                              <div className="form-group">
                                <input type="submit" value="Update Deadline of Application" className="btn btn-primary" />
                              </div>
                              <br></br>
                              <br></br>
                          </Form>
                        </MDBCol>
                      </MDBRow>
                    </MDBContainer>

                    <Form onSubmit={this.onEditingAppl} noValidate>
                      <div class="form-group">
                        <label for="applicants">Maximum number of Applicants: </label>
                        <input id="bt1" type="number" class="form-control"
                        name="max_applications" onChange={this.onChangeMaxAppls}
                         value={this.state.max_appls}
                        />
                      </div>
                    <br/>
                      <div className="form-group">
                        <input type="submit" value="Update Maximum Applicants" className="btn btn-primary" />
                      </div>
                      <br></br>
                      <br></br>
                    </Form>

                    <Form onSubmit={this.onEditingPos} noValidate>
                      <div class="form-group">
                        <label for="positions">Maximum number of Positions: </label>
                        <input id="bt2" type="number" class="form-control"
                        name="max_positions" onChange={this.onChangeMaxPos}
                        value={this.state.max_pos}
                        />
                      </div>
                    <br/>
                      <div className="form-group">
                        <input type="submit" value="Update Maximum Positions" className="btn btn-primary" />
                      </div>
                    </Form>
                    <br></br>
                    <br></br>
                    <br></br>
                
                    <div className="form-group">
                        <input type="submit" value="Go Back to Job List" className="btn btn-warning" />
                    </div>
                    <br/>
                    <br/>
                </Form> 
            </div>
          );
      }
}
                      

