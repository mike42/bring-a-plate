import React from 'react';
import './App.css';
import {useUser} from "./context/user-context";
import UnauthenticatedApp from "./UnauthenticatedApp";
import HostApp from "./HostApp";
import GuestApp from "./GuestApp";

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
