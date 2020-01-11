import React from "react";
import {GuestLoginForm, HostLoginForm} from "../components/login-form";
import {useAuth} from "../context/auth-context";

function UnauthenticatedApp() {
    const {loginGuest, loginHost} = useAuth();

    return (
        <div className="UnauthenticatedApp">
            <header className="App-header">
                Need to log in
            </header>

            <GuestLoginForm onSubmit={loginGuest} buttonText="Login guest" />
            <HostLoginForm onSubmit={loginHost} buttonText="Login host" />
        </div>
    );
}

export default UnauthenticatedApp;