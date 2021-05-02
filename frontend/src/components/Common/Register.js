import React, {Component} from 'react';
import Form from "react-bootstrap/Form";
import axios from 'axios';
var validator = require('validator');

export default class Register extends Component {
    
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            type:"Applicant"
        };

        this.onChangePassword = this.onChangePassword.bind(this);
        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.onChangeType = this.onChangeType.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }
    
    componentDidMount() {
    }

    onChangePassword(event) {
        this.setState({ password: event.target.value });
    }

    onChangeEmail(event) {
        this.setState({ email: event.target.value });
    }

    onChangeType(event) {
        this.setState({ type: event.target.value });
    }

    onSubmit(e) {
        e.preventDefault();

        const newUser = {
            password: this.state.password,
            email: this.state.email,
            type: this.state.type
        };

        let flag = 0;

        if(!validator.isEmail(newUser.email + '')){
            alert("Enter a valid Email");
            this.setState({
                password: '',
                email: '',
                type: "Applicant"
            });
        } else {
            if(newUser.password.length >= 5 && newUser.password.length <= 25){
                axios.post('/user/register', newUser)
                .then(res => {
                    alert("Created\tnew\t" + res.data.type);
                    console.log(res.data);
                   window.location.href = "/user_login";
               })
               .catch((err) => {
                   if (err.response.data) alert(err.response.data);
                 });
   
                this.setState({
                    password: '',
                    email: '',
                    type: "Applicant"
                });
            } else {
                alert("Password must contain atleast 5 characters and atmost 25 characters");
                this.setState({
                    password: '',
                    email: '',
                    type: "Applicant"
                });
            }
        }
    }

    render() {
        return (
            <div>
                <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <label>Email: </label>
                        <input type="email" 
                               className="form-control" 
                               value={this.state.email}
                               onChange={this.onChangeEmail}
                               />  
                    </div>
                    <div className="form-group">
                        <label>Password: </label>
                        <input type="password" 
                               className="form-control" 
                               value={this.state.password}
                               onChange={this.onChangePassword}
                               />
                    </div>
                    <Form.Group controlId="exampleForm.ControlSelect1">
                        <Form.Label>User Type</Form.Label>
                        <Form.Control
                        as="select" value={this.state.type}
                        onChange={this.onChangeType}
                        inputRef={(el) => (this.inputEl = el)}
                        >
                        <option value="Applicant">Applicant</option>
                        <option value="Recruiter">Recruiter</option>
                        </Form.Control>
                        <br></br>
                        <br></br>
                    </Form.Group>
                    <div className="form-group">
                        <input type="submit" value="Register" className="btn btn-primary"/>
                    </div>
                </form>
            </div>
        );
    }
}