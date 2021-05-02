import React from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"

import Home from './components/Common/Home'
import Register from './components/Common/Register'
import Login from './components/Common/Login'
import LogOut from './components/Common/LogOut'
import ApplJobListings from './components/Common/ApplJobListings'
import ApplMyApplications from './components/Common/ApplMyApplications'
import RecAcceptedApplicants from './components/Common/RecAcceptedApplicants'
import RecAddJobListing from './components/Common/RecAddJobListing'
import RecJobApplications from './components/Common/RecJobApplications'
import RecJobListings from './components/Common/RecJobListings'
import UpdateJobForm from './components/Common/UpdateJobForm'
import ApplicationSubmission from './components/Common/ApplicationSubmission'
import Navbar from './components/templates/Navbar'
import ApplNavbar from './components/templates/ApplNavbar'
import RecNavbar from './components/templates/RecNavbar'
import RecProfile from './components/Users/RecProfile'
import ApplProfile from './components/Users/ApplProfile'


function App() {
  let navy;
  if(localStorage.getItem("type") === "Applicant"){
    navy = <ApplNavbar/>;
  } else if(localStorage.getItem("type") === "Recruiter"){
    navy = <RecNavbar/>;
  } else {
    navy = <Navbar/>
  }

  return (
    <Router>
      <div className="container">
        {navy}
        <br/>
        <Route path="/" exact component={Home}/>
        <Route path="/user_register" component={Register}/>
        <Route path="/user_login" component={Login}/>
        <Route path="/user_logout" component={LogOut}/>
        <Route path="/user_profile" component={ApplProfile}/>
        <Route path="/rec_profile" component={RecProfile}/>
        <Route path="/job_listings" component={ApplJobListings}/>
        <Route path="/my_applications" component={ApplMyApplications}/>
        <Route path="/acc_applicants" component={RecAcceptedApplicants}/>
        <Route path="/add_job_listing" component={RecAddJobListing}/>
        <Route path="/job_applications" component={RecJobApplications}/>
        <Route path="/rec_job_listings" component={RecJobListings}/>
        <Route path="/update_job" component={UpdateJobForm}/>
        <Route path="/application_sub" component={ApplicationSubmission}/>
      </div>
    </Router>
  );
}

export default App;
