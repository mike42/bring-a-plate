import React from "react";
import {useAsync} from 'react-async';

export function GuestLoginForm({onSubmit, buttonText}) {
    const {isPending, isRejected, error, run} = useAsync({
        deferFn: args => onSubmit(args[0])
    });

    function handleSubmit(event) {
        event.preventDefault()
        const {code} = event.target.elements;
        run({
            code: code.value
        });
    }

    return (
        <form
            onSubmit={handleSubmit}>
            <label htmlFor="code">Invitation code</label>
            <input id="code"/>
            <div>
                <button type="submit">
                    {buttonText} {isPending ? <span>lalala</span> : null}
                </button>
            </div>
            {isRejected ? (
                <div css={{color: 'red'}}>{error ? error.message : null}</div>
            ) : null}
        </form>);
}

export function HostLoginForm({onSubmit, buttonText}) {
    const {isPending, isRejected, error, run} = useAsync({
        deferFn: args => onSubmit(args[0])
    });

    function handleSubmit(event) {
        event.preventDefault()
        const {username, password} = event.target.elements;
        run({
            username: username.value,
            password: password.value
        });
    }

    return (
        <form
            onSubmit={handleSubmit}>
            <label htmlFor="username">Username</label>
            <input id="username"/>
            <label htmlFor="password">Password</label>
            <input id="password"/>
            <div>
                <button type="submit">
                    {buttonText} {isPending ? <span>lalala</span> : null}
                </button>
            </div>
            {isRejected ? (
                <div css={{color: 'red'}}>{error ? error.message : null}</div>
            ) : null}
        </form>);
}
