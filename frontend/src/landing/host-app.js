import React from "react";
import {useUser} from "../context/user-context";
import {useAuth} from "../context/auth-context";
import PageFooter from "../components/page-footer";
import HostInvitationsComponent from "../components/host-invitations";
import HostAttendeesComponent from "../components/host-attendees";
import HostFoodComponent from "../components/host-food";

function HostApp() {
    const user = useUser()
    const {logout} = useAuth();
    return <div className="bp-authenticated">
        <div className="bp-unauthenticated-backfill"></div>

        <nav className="navbar navbar-dark bg-dark navbar-expand-lg bp-navbar">
            <div className="container">
                {/* eslint-disable-next-line */}
                <a className="navbar-brand" href="#"><img width="30" height="30"
                                                          src={process.env.PUBLIC_URL + '/logo-white.svg'}
                                                          alt={"Bring a plate"}/> Bring a Plate</a>
                <button className="navbar-toggler" type="button" data-toggle="collapse"
                        data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                        aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
            </div>
        </nav>

        <div className="container-wrapper-light">
            <div className="container">
                <div>
                    <p>Welcome {user.name}</p>
                </div>

                <h3>Invitations</h3>
                <HostInvitationsComponent/>

                <h3>Attendees</h3>
                <HostAttendeesComponent/>

                <h3>Food</h3>
                <HostFoodComponent/>

                <h3>Log out</h3>

                <p>Click the button below when you are ready to log out.</p>

                {/* eslint-disable-next-line */}
                <a className="btn btn-primary" href="#" onClick={logout}>Log out</a>
            </div>
        </div>

        <PageFooter/>
    </div>;
}

export default HostApp;
