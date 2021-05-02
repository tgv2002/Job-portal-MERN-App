import React, {Component} from 'react';
import axios from 'axios';

export default class Logout extends Component {
    
    constructor(props) {
        super(props);

        this.state = {
        };
    }

    componentDidMount(){
        localStorage.setItem("type", "");
        localStorage.setItem("id", "");
        localStorage.setItem("email", "");
        window.location.href = "/";
    }
    
    render() {
        return (
            <div><h1></h1>
            </div>
        );
    }
}