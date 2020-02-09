import React from "react";
import {GuestLoginForm, HostLoginForm} from "../components/login-form";
import {useAuth} from "../context/auth-context";


function UnauthenticatedApp() {
    const {loginGuest, loginHost} = useAuth();

    return (
        <div className="bp-unauthenticated">
            <div class="bp-unauthenticated-backfill"></div>
            <div className="bp-landing">
                <header className="bp-header">
                    <a className="bp-logo" href={"/"}>
                        <img className="bp-logo-img" src={process.env.PUBLIC_URL + '/logo-white.svg'}
                             alt={"Bring a plate"}/>
                        <div className="bp-logo-title">
                            Bring&nbsp;a&nbsp;Plate
                        </div>
                    </a>
                    <div className="flex-fill"></div>
                    <div className="bp-host-button d-none d-sm-block">
                        <a className="btn btn-outline-light" href="#host">Host login</a>
                    </div>
                </header>
                <div className="bp-guest-login-wrapper">
                    <div className="bp-guest-login">
                        <h3>Join your event</h3>
                        <p>Enter your invitation code to begin.</p>
                        <GuestLoginForm onSubmit={loginGuest} buttonText="Let's go!"/>
                    </div>
                </div>

            </div>

            <div className="container">
                <div className="row bp-info">
                    <div className="col-md">
                        <div className="landing-info-card">
                            <h3>What is Bring a Plate?</h3>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
                                ut
                                labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                                ullamco
                                laboris nisi ut aliquip ex ea commodo consequat.</p>
                            <p>
                                <ul>
                                    <li>Example</li>
                                    <li>Example</li>
                                    <li>Example</li>
                                </ul>
                            </p>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
                                ut
                                labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                                ullamco
                                laboris nisi ut aliquip ex ea commodo consequat.</p>
                        </div>


                    </div>

                    <div className="col-md">
                        <div className="landing-info-card">
                            <h3>How does it work?</h3>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
                                ut
                                labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                                ullamco
                                laboris nisi ut aliquip ex ea commodo consequat.</p>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
                                ut
                                labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                                ullamco
                                laboris nisi ut aliquip ex ea commodo consequat.</p>
                        </div>

                        <div className="landing-info-card">
                            <a name="host"></a>
                            <h3>Event hosts</h3>
                            <p>Log in here to manage your events.</p>
                            <HostLoginForm onSubmit={loginHost} buttonText="Log in"/>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bp-foot-outer">
                <div className="container">
                    <div className="row bp-foot">
                        <div className="bp-foot-inner">
                            <div className="foot-left">
                                <img className="bp-foot-img" src={process.env.PUBLIC_URL + '/logo-white.svg'}
                                     alt={"Bring a plate"}/>
                            </div>
                            <div className="foot-right">
                                Bring a Plate
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UnauthenticatedApp;