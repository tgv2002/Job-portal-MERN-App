import React, {Component} from 'react';
import axios from 'axios';
var validator = require('validator');

export default class Login extends Component {
    
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: ''
        };

        this.onChangePassword = this.onChangePassword.bind(this);
        this.onChangeEmail = this.onChangeEmail.bind(this);
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

    onSubmit(e) {
        e.preventDefault();

        const logUser = {
            password: this.state.password,
            email: this.state.email,
        }
        
        axios.post('/user/login', logUser)
             .then(res => {
                 localStorage.setItem("type", res.data.type);
                 localStorage.setItem("id", res.data.id);
                 localStorage.setItem("email", res.data.email);
                 alert("You are logged in");
                 console.log(res.data);
                 if(localStorage.getItem("type") === "Applicant"){
                    window.location.href = "/user_profile";
                } else if(localStorage.getItem("type") === "Recruiter"){
                    window.location.href = "/rec_profile";
                } else {
                    //alert("Enter Valid Credentials")
                   // console.log({type: tyype, name: naam, idVal: idd});
                }
                })
                .catch((err) => {
                    if (err.response.data) alert(err.response.data);
                  });
             ;

        this.setState({
            password: '',
            email: ''
        });
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
                    <br></br>
                    <br></br>
                    <br></br>
                    <div className="form-group">
                        <input type="submit" value="Login" className="btn btn-primary"/>
                    </div>
                </form>
            </div>
        );
    }
}