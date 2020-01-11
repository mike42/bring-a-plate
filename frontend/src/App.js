import React from 'react';
import './App.css';
import {useUser} from "./context/user-context";
import UnauthenticatedApp from "./landing/unauthenticated-app";
import HostApp from "./landing/host-app";
import GuestApp from "./landing/guest-app";

function App() {
    const user = useUser();
    if (!user) {
        return <UnauthenticatedApp/>;
    }
    if(user.type === 'HOST') {
        return <HostApp/>
    } else {
        return <GuestApp/>
    }
}

export default App;
