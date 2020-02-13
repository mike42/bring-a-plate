import React from "react";
import {useUser} from "../context/user-context";
import {useAuth} from "../context/auth-context";
import PageFooter from "../components/page-footer";
import {Button, ButtonGroup, Dropdown, Modal} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUtensils} from "@fortawesome/free-solid-svg-icons";

class GuestPeopleComponent extends React.Component {
    state = {
        people: [],
        dietaryDialog: false,
        personId: -1
    };

    attending = async id => {
        console.log("Attending", id);
        await fetch('/api/invitation/' + this.props.user.id + '/people/' + id + '/attending', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({attending: true})
        });
        await this.refreshPeople();
        await this.showRequirements(id);
    };

    notAttending = async id => {
        console.log("Not attending", id);
        await fetch('/api/invitation/' + this.props.user.id + '/people/' + id + '/attending', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({attending: false})
        });
        await this.refreshPeople();
    };

    showRequirementsButton = async ev => {
        let id = Number(ev.currentTarget.id.match(/\d+$/)[0]);
        this.showRequirements(id)
    };

    showRequirements = async id => {
        console.log('Showing requirements for', id);
        fetch('/api/invitation/' + this.props.user.id + '/people/' + id + '/requirements')
            .then(res => res.json())
            .then((data) => {
                this.setState({dietaryDialog: true, personId: id, personRequirements: data});
            })
            .catch(console.log)
    };

    handleClose = ev => {
        console.log('Requirements closed for ' + this.state.personId);
        // TODO maybe save?
        this.setState({dietaryDialog: false, personId: -1});
    };

    refreshPeople() {
        return fetch('/api/invitation/' + this.props.user.id + '/people')
            .then(res => res.json())
            .then((data) => {
                this.setState({people: data.items});
            })
            .catch(console.log)
    }

    componentDidMount() {
        this.refreshPeople();
    }

    render() {
        return <div>
            <p>Welcome, {this.props.user.name}!</p>
            <p>Who will be attending the event?</p>
            {this.state.people.map((person) => (
                <div key={person.id} className="form-group row">
                    <div className="col-sm-2 offset-sm-2 font-weight-bold">{person.name}</div>
                    <div className="col-sm-6">
                        <ButtonGroup>
                            <Dropdown>
                                <Dropdown.Toggle variant="secondary" id={"dropdown-person-" + person.id}>
                                    {person.response === 'Attending.NO_RESPONSE' ? '(Please select)' : ''}
                                    {person.response === 'Attending.YES' ? 'Attending' : ''}
                                    {person.response === 'Attending.NO' ? 'Not attending' : ''}
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                    <Dropdown.Item onSelect={this.attending} eventKey={person.id}>Attending</Dropdown.Item>
                                    <Dropdown.Item onSelect={this.notAttending} eventKey={person.id}>Not attending</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </ButtonGroup>
                        &nbsp;
                        {person.response === 'Attending.YES' ? (
                        <ButtonGroup>
                            <Button variant="secondary" onClick={this.showRequirementsButton} id={'person-food-' + person.id}><FontAwesomeIcon id="ya" icon={faUtensils} /></Button>
                        </ButtonGroup>) :''}
                    </div>
                </div>
            ))}
            <Modal show={this.state.dietaryDialog} onHide={this.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Dietary requirements</Modal.Title>
                </Modal.Header>
                <Modal.Body>



                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={this.handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
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