import React from "react";
import {useUser} from "./context/user-context";

function GuestApp() {
    const user = useUser();
    return <p>Welcome guest {user.name}</p>;
}

export default GuestApp;