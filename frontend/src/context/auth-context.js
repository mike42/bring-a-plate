import React from 'react'
import {useAsync} from 'react-async'
import axios from 'axios';

async function bootstrapAppData() {
    try {
        const resp = await axios.get('/api/auth/');
        return { user: resp.data }
    } catch (e) {
        // Failed request of non-2XX return code -> assume user is not logged in
        return {user: null}
    }
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
    const loginGuest = form => axios.post('/api/auth/login/guest', form).then(reload);
    const loginHost = form => axios.post('/api/auth/login/host', form).then(reload);
    const logout = () => axios.post('/api/auth/logout', {}).then(reload);
    return (
        <AuthContext.Provider value={{data, loginGuest, logout, loginHost}} {...props} />
    )
}

const useAuth = () => React.useContext(AuthContext)

export {AuthProvider, useAuth}
