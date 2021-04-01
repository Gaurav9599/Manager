import React, { Component } from "react";
import "../home/header.css";
import Form from "react-bootstrap/Form";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import { firestore, app, auth } from "../firebase";
import { FaEyeSlash } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import "./login.css";

class Login extends Component {
    constructor() {
        super();
        this.state = {
            email: "",
            password: "",
            phone: "",
            email_mobile: "",
            unauthorized_error: "",
            password_error: "",
            is_password_shown: false
        };
    }

    togglePassword = () => {
        const { is_password_shown } = this.state;
        this.setState({ is_password_shown: !is_password_shown });
    };

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    };

    handleLoginSubmit = (event) => {
        event.preventDefault();
        const pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const phone_pattern = /^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/;
        if (pattern.test(this.state.email_mobile)) {
            this.setState({ unauthorized_error: "", password_error: "" });
            auth.signInWithEmailAndPassword(
                this.state.email_mobile,
                this.state.password
            )
                .then((res) => {
                    if (res.user.uid) this.props.history.push(`/portal`);
                })
                .catch((error) => {
                    //Handle Errors here.
                    if (error.code === "auth/user-not-found")
                        this.setState({ unauthorized_error: error.message });
                    if (error.code === "auth/wrong-password")
                        this.setState({ password_error: error.message });
                });
        }
        if (phone_pattern.test(this.state.email_mobile)) {
            let recaptcha = new app.auth.RecaptchaVerifier(
                "recaptcha_container"
            );
            app.auth()
                .signInWithPhoneNumber(this.state.email_mobile, recaptcha)
                .then((e) => {
                    let code = prompt("enter the otp", "");
                    if (code == null) return;
                    e.confirm(code)
                        .then((res) => {
                            if (res.user.uid)
                                this.props.history.push(`/portal`);
                        })
                        .catch((error) => {
                            console.error(error);
                        });
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    };

    render() {
        const { is_password_shown } = this.state;
        return (
            <div className="bg row">
                <div className="col-lg-6 m-auto  pt-5 pb-5">
                    <Form
                        className="login_form"
                        onSubmit={this.handleLoginSubmit}
                    >
                        <h1 className=" pt-5 pb-4">Login</h1>
                            <hr className="seperator pb-3" />
                        <div
                            className="d-flex justify-content-center"
                            id="recaptcha_container"
                        >   
                        </div>
                        <Form.Group controlId="formBasicName">
                            <Form.Control
                                name="email_mobile"
                                className="input_box"
                                onChange={this.handleChange}
                                type="text"
                                placeholder="Email/Mobile number"
                                required
                            />
                            <Form.Text className="text-danger">
                                {this.state.unauthorized_error}
                            </Form.Text>
                        </Form.Group>

                        <Form.Group controlId="formBasicEmail" className="mb-0">
                            <Form.Control
                                className="input_box"
                                name="password"
                                onChange={this.handleChange}
                                type={is_password_shown ? "text" : "password"}
                                placeholder="Password"
                            />
                            <i className="eye" onClick={this.togglePassword}>
                                {" "}
                                {is_password_shown ? (
                                    <FaEyeSlash title="hide" />
                                ) : (
                                    <FaEye title="show" />
                                )}
                            </i>
                            <Form.Text className="text-danger">
                                {this.state.password_error}
                            </Form.Text>
                        </Form.Group>
                        <p className="paragraph float-right mr-5 mb-0">
                            <Link to="/forgot_pass">Forgot Password?</Link>
                        </p>
                        <br />
                        <br />
                        <Button className="popup_button" type="submit">
                            Login
                        </Button>
                        <p className="pt-4 paragraph">
                            New to Manager?
                            <Link to="/signup"> Register Here.</Link>
                        </p>
                    </Form>
                </div>
            </div>
        );
    }
}

export default Login;
