import React from "react";
import {useUser} from "../context/user-context";
import {useAuth} from "../context/auth-context";
import PageFooter from "../components/page-footer";

const People = ({ people }) => {
    return (
        <div>
            {people.map((person) => (
                <div key={person.id} className="form-group row">
                    <div className="col-sm-2 offset-sm-2 font-weight-bold">{person.name}</div>
                    <div className="col-sm-6">{person.response}</div>
                </div>
            ))}
        </div>
    )
};

class GuestPeopleComponent extends React.Component {
    state = {
        people: []
    };

    componentDidMount() {
        fetch('/api/invitation/' + this.props.user.id + '/people')
            .then(res => res.json())
            .then((data) => {
                this.setState({people: data.items});
            })
            .catch(console.log);
    }

    render() {
        return <div>
            <p>Welcome, {this.props.user.name}!</p>
            <People people={this.state.people}/>
        </div>;
    }
}

function GuestApp() {
    const user = useUser();
    const {logout} = useAuth();
    return <div>
        <div className="bp-unauthenticated-backfill"></div>

        <nav className="navbar navbar-dark bg-dark navbar-expand-lg bp-navbar">
            <div className="container">
                {/* eslint-disable-next-line */}
                <a className="navbar-brand" href="#"><img width="30" height="30"
                                                          src={process.env.PUBLIC_URL + '/logo-white.svg'}
                                                          alt={"Bring a plate"}/> Bring a Plate</a>
                <button className="navbar-toggler" type="button" data-toggle="collapse"
                        data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                        aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
            </div>
        </nav>

        <div className="container-wrapper-light">
            <div className="container">
                <h3>People</h3>

                <GuestPeopleComponent user={user}/>

                <h3>Food</h3>
                <div className="card mb-3">
                    <div className="card-header">
                        Mains
                    </div>
                    <ul className="list-group list-group-flush">
                        <li className="list-group-item">Spaghetti Carbonara</li>
                    </ul>
                </div>

                <div className="card mb-3">
                    <div className="card-header">
                        Salads
                    </div>
                    <ul className="list-group list-group-flush">
                        <li className="list-group-item">Kale salad</li>
                    </ul>
                </div>

                <div className="card mb-3">
                    <div className="card-header">
                        Desserts
                    </div>
                    <ul className="list-group list-group-flush">
                        <li className="list-group-item">Pavlova</li>
                    </ul>
                </div>

                <h3>All done!</h3>

                <p>Click the button below when you are ready to log out.</p>

                {/* eslint-disable-next-line */}
                <a className="btn btn-primary" href="#" onClick={logout}>Logout</a>
            </div>
        </div>

        <PageFooter/>
    </div>;
}

export default GuestApp;