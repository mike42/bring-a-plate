import React from "react";
import {useUser} from "../context/user-context";
import {useAuth} from "../context/auth-context";

function GuestApp() {
    const user = useUser();
    const {logout} = useAuth();
    return <div>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <a className="navbar-brand" href="#">#</a>
            <button className="navbar-toggler" type="button" data-toggle="collapse"
                    data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                    aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
        </nav>

        <div>
            <p>Welcome guest {user.name}</p>
            <a href="#" onClick={logout}>Logout</a>
        </div>
    </div>;
}

export default GuestApp;