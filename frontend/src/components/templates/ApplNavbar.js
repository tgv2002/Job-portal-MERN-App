import React, {Component} from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"

export default class NavBar extends Component {
    
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>                
                <nav className="navbar navbar-expand-lg navbar-light bg-light">
                    <Link to="/" className="navbar-brand">Job Portal</Link>
                    <div className="collapse navbar-collapse">
                        <ul className="navbar-nav mr-auto">
                            <li className="navbar-item">
                                <Link to="/user_profile" className="nav-link">My Profile</Link>
                            </li>
                            <li className="navbar-item">
                                <Link to="/job_listings" className="nav-link">Job Listings</Link>
                            </li>
                            <li className="navbar-item">
                                <Link to="/my_applications" className="nav-link">My Applications</Link>
                            </li>
                            <li className="navbar-item">
                                <Link to="/user_logout" className="nav-link">Sign out</Link>
                            </li>                            
                        </ul>
                    </div>
                </nav>
            </div>
        )
    }
}