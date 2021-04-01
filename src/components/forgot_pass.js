import React, { Component } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import "../components/forgot.css";
import Row from "react-bootstrap/Row";

class ForgotPassword extends Component {
    constructor() {
        super();
        this.state = {
            email: "",
            phone: "",
            checked: true
        };
        this.handleRadioChange = this.handleRadioChange.bind(this);
    }

    handleRadioChange() {
        const { checked } = this.state;
        this.setState({ checked: !checked });
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    };

    handleSubmit = (event) => {
        alert(JSON.stringify(this.state));
        event.preventDefault();
    };

    render() {
        return (
            <div className="bg row">
                <div className="col-lg-6 m-auto pt-5 pb-4">
                    <Form
                        className="forgot_form pt-3"
                        onSubmit={this.handleSubmit}
                    >
                        <h2 className="line heading pt-2 pb-3">
                            Forgot Password
                        </h2>
                        <div className="pt-3 mb-4">
                            <br/>
                            <Row>
                                <Form.Check
                                    inline
                                    label="Email"
                                    defaultChecked
                                    onChange={this.handleRadioChange}
                                    type="radio"
                                    name="radio"
                                />
                                <Form.Check
                                    inline
                                    label="Mobile Number"
                                    onChange={this.handleRadioChange}
                                    type="radio"
                                    name="radio"
                                />
                            </Row>
                        </div>
                        {this.state.checked ? (
                            <Form.Group controlId="formBasicName">
                                <Form.Control
                                    className="input_box"
                                    name="email"
                                    onChange={this.handleChange}
                                    type="text"
                                    placeholder="Email"
                                    required
                                />
                            </Form.Group>
                        ) : (
                            <Form.Group controlId="formBasicName">
                                <Form.Control
                                    className="input_box"
                                    name="phone"
                                    onChange={this.handleChange}
                                    type="text"
                                    placeholder="Mobile number"
                                    required
                                />
                            </Form.Group>
                        )}
                        <br/>
                        <Button
                            className="text-center popup_button"
                            type="submit"
                        >
                            <Link to="/verify" className="text-white">
                                {" "}
                                Go{" "}
                            </Link>
                        </Button>
                        <br />
                        <p className="pt-4 paragraph">
                            Remember your Password?<Link to="login">LOGIN</Link>{" "}
                            here.
                        </p>
                    </Form>
                </div>
            </div>
        );
    }
}

export default ForgotPassword;
