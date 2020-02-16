import React from "react";
import {Button, ButtonGroup, Dropdown, Form, Modal} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUtensils} from "@fortawesome/free-solid-svg-icons";

class GuestPeopleComponent extends React.Component {
    state = {
        people: [],
        dietaryDialog: false,
        personId: -1,
        personRequirements: {
            name: '',
            allergen: [],
            special_preparation: []
        }
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

    reqChange = ev => {
        let idx = Number(ev.currentTarget.id.match(/\d+$/)[0]);
        console.log("Dietary requirement number " + idx + " changed");
        const newReq = this.state.personRequirements;
        newReq.special_preparation[idx].value = !newReq.special_preparation[idx].value;
        this.setState({personRequirements: newReq});
    };

    allergenChange = ev => {
        let idx = Number(ev.currentTarget.id.match(/\d+$/)[0]);
        console.log("Allergen number " + idx + " changed");
        const newReq = this.state.personRequirements;
        newReq.allergen[idx].value = !newReq.allergen[idx].value;
        this.setState({personRequirements: newReq});
    };

    handleClose = async ev => {
        console.log('Requirements closed for ' + this.state.personId);
        await fetch('/api/invitation/' + this.props.user.id + '/people/' + this.state.personId + '/requirements', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(this.state.personRequirements)
        });
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
                <div key={person.id} className="form-group row" style={{marginLeft: '1em'}}>
                    <div className="col-sm-2 font-weight-bold person-name-col">{person.name}</div>
                    <div className="col-sm-6">
                        <ButtonGroup>
                            <Dropdown>
                                <Dropdown.Toggle variant="outline-secondary" id={"dropdown-person-" + person.id}>
                                    {person.response === 'Attending.NO_RESPONSE' ? 'Please select' : ''}
                                    {person.response === 'Attending.YES' ? 'Attending' : ''}
                                    {person.response === 'Attending.NO' ? 'Not attending' : ''}
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                    <Dropdown.Item onSelect={this.attending}
                                                   eventKey={person.id}>Attending</Dropdown.Item>
                                    <Dropdown.Item onSelect={this.notAttending} eventKey={person.id}>Not
                                        attending</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </ButtonGroup>
                        &nbsp;
                        {person.response === 'Attending.YES' ? (
                            <ButtonGroup>
                                <Button variant="outline-secondary" onClick={this.showRequirementsButton}
                                        id={'person-food-' + person.id}><FontAwesomeIcon id="ya"
                                                                                         icon={faUtensils}/></Button>
                            </ButtonGroup>) : ''}
                    </div>
                </div>
            ))}
            <Modal show={this.state.dietaryDialog} onHide={this.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Dietary requirements: {this.state.personRequirements.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>To help people to decide what to bring, please tick any boxes which apply.</p>

                    <p>I am allergic to:</p>
                    <div className="bp-checkbox-row">
                        {this.state.personRequirements.allergen.map((allergen, idx) => (
                            <div key={idx} className="bp-checkbox-item">
                                <Form.Group controlId={'allergen-check-' + idx}>
                                    <Form.Check type="checkbox" label={allergen.name} checked={allergen.value}
                                                onChange={this.allergenChange}/>
                                </Form.Group>
                            </div>
                        ))}
                    </div>
                    <p>I only eat food which is:</p>
                    <div className="bp-checkbox-row">
                        {this.state.personRequirements.special_preparation.map((prep, idx) => (
                            <div key={idx} className="bp-checkbox-item">
                                <Form.Group controlId={'special-prep-check-' + idx}>
                                    <Form.Check type="checkbox" label={prep.name} checked={prep.value}
                                                onChange={this.reqChange}/>
                                </Form.Group>
                            </div>
                        ))}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={this.handleClose}>
                        Done
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>;
    }
}

export default GuestPeopleComponent;