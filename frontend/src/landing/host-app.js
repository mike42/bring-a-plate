import React from "react";
import {useUser} from "../context/user-context";
import {useAuth} from "../context/auth-context";
import PageFooter from "../components/page-footer";

function HostApp() {
    const user = useUser()
    const {logout} = useAuth();
    return <div>
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

                <table className="table table-sm">
                    <tr>
                        <th>Code</th>
                        <th>Invitation</th>
                        <th>People</th>
                        <th>Actions</th>
                    </tr>
                    <tr>
                        <td>example</td>
                        <td>Jones family</td>
                        <td><ul>
                            {/* eslint-disable-next-line*/}
                            <li>Alice <a href="#" className="badge badge-danger">x</a></li>
                            {/* eslint-disable-next-line*/}
                            <li>Bob <a href="#" className="badge badge-danger">x</a></li>
                            {/* eslint-disable-next-line*/}
                            <li>Carl <a href="#" className="badge badge-danger">x</a></li>
                        </ul>
                        </td>
                        <td>
                            <div className="btn-group">
                                <button className="btn btn-outline-primary">+1</button>
                                <button className="btn btn-outline-danger">Uninvite</button>

                            </div>

                        </td>
                    </tr>

                </table>

                <h3>Attendees</h3>

                <h3>Food</h3>

                <h3>Log out</h3>

                <p>Click the button below when you are ready to log out.</p>

                {/* eslint-disable-next-line */}
                <a className="btn btn-primary" href="#" onClick={logout}>Logout</a>
            </div>
        </div>

        <PageFooter/>
    </div>;
}

export default HostApp;
