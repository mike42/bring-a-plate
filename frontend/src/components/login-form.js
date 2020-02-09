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
        <form className="form-group"
              onSubmit={handleSubmit}>
            {isRejected ? (
                <div className="bp-guest-login-error">{error ? 'Login failed' : null}</div>
            ) : null}
            <div className="form-group">
                <input autoFocus placeholder="Invitation code" autocomplete="off" className="form-control" id="code"/>
            </div>
            <button type="submit" disabled={isPending} className="btn btn-primary">
                {buttonText}
            </button>
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
            onSubmit={handleSubmit} className="form-group">
            {isRejected ? (
                <div className="bp-guest-login-error">{error ? 'Login failed' : null}</div>
            ) : null}
            <div className="form-group">
                <label htmlFor="username">Username</label>
                <input class="form-control" id="username"/>
            </div>
            <div className="form-group">
                <label htmlFor="password">Password</label>
                <input class="form-control"  type="password" id="password"/>
            </div>
            <div>
                <button className="btn btn-primary" disabled={isPending} type="submit">
                    {buttonText}
                </button>
            </div>
        </form>);
}
