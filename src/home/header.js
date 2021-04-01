import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { Navbar, Nav } from "react-bootstrap";
import "./header.css";

class Header extends Component {
    render() {
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-lg-12 p-0 m-0">
                        <Navbar className="bg-dark" expand="lg">
                            <Navbar.Brand href="/">HOME</Navbar.Brand>
                            <Navbar.Toggle aria-controls="basic-navbar-nav" />
                            <Navbar.Collapse id="basic-navbar-nav">
                                <Nav className="justify-content-end w-100">
                                    <NavLink
                                        exact
                                        className="anchor"
                                        activeClassName="active"
                                        to="/login"
                                    >
                                        LOGIN
                                    </NavLink>
                                    <NavLink
                                        exact
                                        className="anchor"
                                        activeClassName="active"
                                        to="/signup"
                                    >
                                        SIGN UP
                                    </NavLink>
                                </Nav>
                            </Navbar.Collapse>
                        </Navbar>
                    </div>
                </div>
            </div>
        );
    }
}

export default Header;
