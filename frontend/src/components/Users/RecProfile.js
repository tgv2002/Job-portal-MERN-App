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
      nam: "",
      cont: "",
      bi: "",
      ema: ""
    };

    this.onChangeProfileName = this.onChangeProfileName.bind(this);
    this.onChangeProfileContact = this.onChangeProfileContact.bind(this);
    this.onChangeProfileBio = this.onChangeProfileBio.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);

    this.onEditingProfileName = this.onEditingProfileName.bind(this);
    this.onEditingProfileContact = this.onEditingProfileContact.bind(this);
    this.onEditingProfileBio = this.onEditingProfileBio.bind(this);
    this.onEditingEmail = this.onEditingEmail.bind(this);
  }

  componentDidMount() {

    axios.get("/user/profile/" + localStorage.getItem("id"))
    .then(res => this.setState({ 
      user: res.data,
      nam: res.data.name,
      cont: res.data.contact,
      bi: res.data.bio,
      ema: res.data.email
    }));
  }

  onChangeProfileName(e){
    this.setState({nam: e.target.value});
  }

  onEditingProfileName(e){
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
   window.location.href = "/rec_profile";

      })
      .catch((err) => {
        if (err.response.data) alert(err.response.data);
   window.location.href = "/rec_profile";

      });
  }

  onChangeProfileContact(e){
    this.setState({cont: e.target.value});
  }

  onEditingProfileContact(e){
    e.preventDefault();
    var req = {
      contact: this.state.cont
    };

    console.log(req);

    axios
      .post("/user/profile/update_contact/" + localStorage.getItem("id"), req)
      .then((res) => {
        console.log(res);
   window.location.href = "/rec_profile";

      })
      .catch((err) => {
        if (err.response.data) alert(err.response.data);
   window.location.href = "/rec_profile";

      });
  }

  onChangeProfileBio(e){
    this.setState({bi: e.target.value});
  }

  onEditingProfileBio(e){
    e.preventDefault();
    var req = {
      bio: this.state.bi
    };

    console.log(req);

    if(req.bio.split(/\s+/).length > 250){
      alert("Bio cannot exceed 250 words");
      window.location.href = "/rec_profile";
    } else {
      axios
      .post("/user/profile/update_bio/" + localStorage.getItem("id"), req)
      .then((res) => {
        console.log(res);
      window.location.href = "/rec_profile";

      })
      .catch((err) => {
        if (err.response.data) alert(err.response.data);
      window.location.href = "/rec_profile";

      });
    }
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
     window.location.href = "/rec_profile";

        })
        .catch((err) => {
          if (err.response.data) alert(err.response.data);
     window.location.href = "/rec_profile";

        });
    } else {
      alert("A valid Email should be entered while updating");
      window.location.href = "/rec_profile";
    }
  }

  render() {
    return (
      <div>

<Form onSubmit={this.onEditingProfileName} noValidate>
                      <div class="form-group">
                        <label for="name">Name: </label>
                        <input type="text" class="form-control"
                        name="name" onChange={this.onChangeProfileName}
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

        <Form onSubmit={this.onEditingProfileBio} noValidate>
                      <div class="form-group">
                        <label for="bio">Bio: </label>
                        <input type="text" class="form-control"
                        name="bio" onChange={this.onChangeProfileBio}
                         value={this.state.bi}
                        />
                      </div>
                    <br/>
                      <div className="form-group">
                        <input type="submit" value="Update Bio" className="btn btn-primary" />
                      </div>
                      <br></br>
                      <br></br>
        </Form>

        <Form onSubmit={this.onEditingProfileContact} noValidate>
                      <div class="form-group">
                        <label for="contact">Contact: </label>
                        <input type="text" class="form-control"
                        name="contact" onChange={this.onChangeProfileContact}
                         value={this.state.cont}
                        />
                      </div>
                    <br/>
                      <div className="form-group">
                        <input type="submit" value="Update Contact" className="btn btn-primary" />
                      </div>
                      <br></br>
                      <br></br>
        </Form>
        {/*<div>{avg_rating(this)}</div>*/}
      </div>
    );
  }
}
