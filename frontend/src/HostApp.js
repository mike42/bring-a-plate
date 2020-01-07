import React from "react";
import {useUser} from "./context/user-context";

function HostApp() {
    const user = useUser();
    return <p>Welcome host {user.name}</p>;
}

export default HostApp;