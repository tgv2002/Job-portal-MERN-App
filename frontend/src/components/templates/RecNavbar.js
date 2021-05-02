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
                                <Link to="/rec_profile" className="nav-link">My Profile</Link>
                            </li>
                            <li className="navbar-item">
                                <Link to="/acc_applicants" className="nav-link">My Employees</Link>
                            </li>
                            <li className="navbar-item">
                                <Link to="/rec_job_listings" className="nav-link">Posted Jobs</Link>
                            </li>
                            <li className="navbar-item">
                                <Link to="/add_job_listing" className="nav-link">Add Job Listing</Link>
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