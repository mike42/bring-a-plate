import React from "react";
import {useUser} from "../context/user-context";
import {useAuth} from "../context/auth-context";

function GuestApp() {
    const user = useUser();
    const {logout} = useAuth();
    return <div>
        <p>Welcome guest {user.name}</p>
        <a href="#" onClick={logout}>Logout</a>
    </div>;
}

export default GuestApp;