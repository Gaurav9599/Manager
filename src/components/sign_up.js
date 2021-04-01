import React, { Component } from "react";
import Form from "react-bootstrap/Form";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import { firestore, auth } from "../firebase";
import "./signup.css";

class Signup extends Component {
    constructor() {
        super();
        this.state = {
            fullname: "",
            email: "",
            company: "",
            password: "",
            confirm_password: "",
            weak_password: "",
            used_email: "",
            confirm_password_error: ""
        };
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    };

    checkValid() {
        if (this.state.password !== this.state.confirm_password) {
            this.setState({
                confirm_password_error:
                    "Password and confirm password must be same"
            });
            return false;
        } else return true;
    }

    handleSubmit = (event) => {
        event.preventDefault();
        if (this.checkValid()) {
            auth.createUserWithEmailAndPassword(
                this.state.email,
                this.state.password
            )
                .then(async (res) => {
                    let uid = res.user.uid;
                    firestore.collection("Users").doc(res.user.uid).set({
                        uid,
                        fullname: this.state.fullname,
                        email: this.state.email,
                        phone: this.state.phone,
                        company: this.state.company,
                        is_active: true
                    });
                    this.props.history.push("/login");
                })
                .catch((error) => {
                    if (error.code === "auth/email-already-in-use")
                        this.setState({ used_email: error.message });
                    if (error.code === "auth/weak-password")
                        this.setState({ weak_password: error.message });
                });
        }
    };

    render() {
        return (
            <div className="bg row">
                <div className="m-auto pt-4 pb-4">
                    <Form className="signup_form" onSubmit={this.handleSubmit}>
                        <h1 className="pt-2">Sign Up</h1>
                        <p className="paragraph">
                            Already Registered?
                            <span>
                                <Link to="/login"> LOGIN </Link>
                            </span>
                            here
                        </p>
                        <Form.Group controlId="formBasicName">
                            <Form.Control
                                className="input_box"
                                name="fullname"
                                onChange={this.handleChange}
                                type="text"
                                placeholder="Full Name"
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Control
                                className="input_box"
                                name="email"
                                onChange={this.handleChange}
                                type="email"
                                placeholder="Email"
                            />
                            <Form.Text className="text-danger">
                                {this.state.used_email}
                            </Form.Text>
                        </Form.Group>
                        <Form.Group controlId="formBasiccompany">
                            <Form.Control
                                className="input_box"
                                name="company"
                                onChange={this.handleChange}
                                type="text"
                                placeholder="Company Name"
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formBasicPhone">
                            <Form.Control
                                className="input_box"
                                name="phone"
                                onChange={this.handleChange}
                                type="text"
                                placeholder="Mobile number"
                            />
                        </Form.Group>
                        <Form.Group controlId="formBasicPassword">
                            <Form.Control
                                className="input_box"
                                name="password"
                                onChange={this.handleChange}
                                type="password"
                                placeholder="Password"
                            />
                        </Form.Group>
                        <Form.Group controlId="formBasicPasswordAgain">
                            <Form.Control
                                className="input_box"
                                name="confirm_password"
                                onChange={this.handleChange}
                                type="password"
                                placeholder="Confirm password"
                            />
                            <Form.Text className="text-danger">
                                {this.state.confirm_password_error}
                                {this.state.weak_password}
                            </Form.Text>
                        </Form.Group>
                        <Button className="mb-4 popup_button" type="submit">
                            Sign Up
                        </Button>
                    </Form>
                </div>
            </div>
        );
    }
}

export default Signup;
