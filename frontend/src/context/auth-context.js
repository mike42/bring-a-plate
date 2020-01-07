import React from 'react'
import {useAsync} from 'react-async'
import axios from 'axios';

async function bootstrapAppData() {
    const resp = await axios.get('/api/auth/');
    console.log("/api/auth/ -> ", resp.data);
    if (resp.status < 200 || resp.status > 299) {
        return {user: null}
    }
    return { user: resp.data }
}

const AuthContext = React.createContext();

function AuthProvider(props) {
    const [firstAttemptFinished, setFirstAttemptFinished] = React.useState(false);
    const {
        data = {user: null},
        error,
        isRejected,
        isPending,
        isSettled,
        reload,
    } = useAsync({
        promiseFn: bootstrapAppData,
    });

    React.useLayoutEffect(() => {
        if (isSettled) {
            setFirstAttemptFinished(true)
        }
    }, [isSettled]);

    if (!firstAttemptFinished) {
        if (isPending) {
            return <p>Loading...</p>
        }
        if (isRejected) {
            return (
                <div css={{color: 'red'}}>
                    <p>Uh oh... There's a problem. Try refreshing the app.</p>
                    <pre>{error.message}</pre>
                </div>
            )
        }
    }
    const loginGuest = form => axios.post('/auth/login/guest', form).then(reload);
    const loginHost = form => axios.post('/auth/login/user', form).then(reload);
    const logout = () => axios.post('/auth/logout').then(reload);
    return (
        <AuthContext.Provider value={{data, loginGuest, logout, loginHost}} {...props} />
    )
}

const useAuth = () => React.useContext(AuthContext)

export {AuthProvider, useAuth}
