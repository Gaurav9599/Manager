import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import './header.css';
import { auth } from "../firebase";
import { withRouter } from 'react-router-dom';

class Header1 extends React.Component {

    constructor() {
        super();
    }
    
    logoutUser = () => {
        auth.signOut().then((data) => {
            this.props.history.push('/signin');
        })
        .catch((error) => {
            console.error(error);
        });
    }
    render() {
        return (
            <div>
                <Navbar collapseOnSelect expand="lg" className="bg-dark py-0" variant="dark">
                    <Navbar.Brand href="#home" className="ml-2"><h4 className="logo">Employee</h4>
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="mr-auto">
                        </Nav>
                        <Button variant="info" onClick={this.logoutUser} className="px-3 py-0 mr-2">Logout</Button>
                    </Navbar.Collapse>
                 </Navbar>
            </div>
        );
    }
}

export default withRouter(Header1) ;
