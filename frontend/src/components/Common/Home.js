import React, {Component} from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export default class Home extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {
    }

    render() {
        return (
            <div>
                <Container>
                    <Row>
                        <Col>
                        <h1>WELCOME TO THIS JOB PORTAL! YOU CAN APPLY TO OR POST JOBS HERE.</h1>
                        </Col>
                    </Row>
                </Container>
           </div>
        );
    }
}