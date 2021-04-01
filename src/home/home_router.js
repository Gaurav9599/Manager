import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import Signup from "../components/sign_up";
import Login from "../components/login";
import ForgotPassword from "../components/forgot_pass";
import Header from "../home/header";
import Portal from "../portal/portal";
import Header1 from "../portal/header";
import Footer from "../portal/footer";
import { auth } from "../firebase";

class HomeRouter extends React.Component {
    constructor() {
        super();
        this.state = {
            login_sec: false
        };
    }

    componentDidMount = async () => {
        await auth.onAuthStateChanged((user) => {
            if (user) this.setState({ login_sec: true });
            else this.setState({ login_sec: false });
        });
    };

    render() {
        return (
            <>
                {this.state.login_sec === false ? <Header /> : <Header1 />}
                <Redirect to = "/login" />
                <Switch>
                    <Route exact path="/login" component={Login} />
                    <Route path="/forgot_pass" component={ForgotPassword} />
                    <Route path="/signup" component={Signup} />
                    <Route path="/portal" component={Portal} />
                    <Redirect to="/login" />
                </Switch>
                <Footer/>
            </>
        );
    }
}

export default HomeRouter;
