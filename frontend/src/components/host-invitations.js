import * as React from "react";
import {Button, Col, Form, InputGroup, Modal, Row} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faDownload, faPlus, faRedo} from "@fortawesome/free-solid-svg-icons";

class HostInvitationsComponent extends React.Component {
    state = {
        validationProblem: undefined,
        invitations: [],
        addInvitationName: '',
        addInvitationCode: '',
        addInvitationDialog: false,
        addPersonInvitationId: undefined,
        addPersonDialog: false,
        addPersonName: ''
    };

    componentDidMount() {
        this.refreshInvites();
    }

    refreshInvites = async ev => {
        let result = await fetch('/api/invitation/')
            .then(res => res.json());
        this.setState({
            invitations: result.items
        });
    };

    addInvitation = ev => {
        this.setCode();
        this.setState({
            validationProblem: undefined,
            addInvitationName: '',
            addInvitationDialog: true
        });
    };

    handleClose = ev => {
        this.setState({
            addInvitationDialog: false,
            addPersonDialog: false,
        });
    };

    saveInvitation = async ev => {
        if(this.state.addInvitationName === '' || this.state.addInvitationCode === '') {
            this.setState({
                validationProblem: 'Some required fields are blank'
            });
            return;
        }
        await fetch('/api/invitation/', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                name: this.state.addInvitationName,
                code: this.state.addInvitationCode
            })
        }).then(async res =>  {
            await this.refreshInvites();
            this.setState({
                addInvitationDialog: false
            });
        }).catch(res => {
            this.setState({
                validationProblem: 'Failed'
            });
        });
    };

    savePerson = async ev => {
        if(this.state.addPersonName === '') {
            this.setState({
                validationProblem: 'Some required fields are blank'
            });
            return;
        }
        await fetch('/api/invitation/' + this.state.addPersonInvitationId + '/people', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                name: this.state.addPersonName,
            })
        }).then(async res =>  {
            await this.refreshInvites();
            this.setState({
                addPersonDialog: false
            });
        }).catch(res => {
            this.setState({
                validationProblem: 'Failed'
            });
        });
    };

    addInvitationNameChange = ev => {
        this.setState({
            addInvitationName: ev.currentTarget.value
        });
    };

    addInvitationCodeChange = ev => {
        this.setState({
            addInvitationCode: ev.currentTarget.value
        });
    };

    addPersonNameChange = ev => {
        this.setState({
            addPersonName: ev.currentTarget.value
        });
    };

    setCode = () => {
        let letters = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
        let digits = 6;
        let result = '';
        for(let i = 0; i < digits; i++) {
            result += letters[Math.floor(Math.random() * letters.length)];
        }
        this.setState({
            addInvitationCode: result
        });
    };

    removePerson = async (ev, invitation, person) => {
        if (!window.confirm("Are you sure?")) {
            return
        }
        ev.preventDefault();
        await fetch('/api/invitation/' + invitation.id + '/people/' + person.id, {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'}
        });
        await this.refreshInvites();
    };

    addPerson  = async (ev, invitation) => {
        this.setState({
            addPersonInvitationId: invitation.id,
            addPersonDialog: true,
            addPersonName: '',
            validationProblem: undefined
        });
    };

    removeInvitation = async (ev, invitation) => {
        if (!window.confirm("Are you sure?")) {
            return
        }
        await fetch('/api/invitation/' + invitation.id, {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'}
        });
        await this.refreshInvites();
    };

    render() {
        return <div>
            <p>Manage invitations</p>

            <table className="table table-sm">
                <thead>
                <tr>
                    <th>Code</th>
                    <th>Invitation</th>
                    <th>Actions</th>
                    <th>People</th>
                </tr>
                </thead>
                <tbody>
                {this.state.invitations.map((invitation, idx) => (
                    <tr key={idx}>
                        <td>{invitation.code}</td>
                        <td>{invitation.name}</td>
                        <td>
                            <div className="btn-group">
                                <button className="btn btn-sm btn-outline-primary" onClick={(ev) => this.addPerson(ev, invitation)}>+1</button>
                                <button className="btn btn-sm btn-outline-danger" onClick={(ev) => this.removeInvitation(ev, invitation)}>Delete</button>
                            </div>
                        </td>
                        <td>
                            <ul className="list-group list-group-flush">

                                {invitation.people.map((person, idxPerson) => (
                                    <li key={idxPerson} className="list-group-item d-flex justify-content-between align-items-center borderless">
                                        <span>
                                            {person.name}
                                            {person.response === 'Attending.YES' ? ' (Attending)' : null}
                                            {person.response === 'Attending.NO' ? ' (Not attending)' : null}
                                        </span>
                                        <a href="/#" onClick={(ev) => this.removePerson(ev, invitation, person)} className="badge badge-light badge-pill">x</a>
                                    </li>
                                ))}
                            </ul>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <p style={{marginBottom: '4rem'}}>
                <Button variant="outline-secondary" onClick={this.addInvitation}><FontAwesomeIcon icon={faPlus}/> Add invitation</Button>
                &nbsp;
                <a className="btn btn-outline-secondary" href="/api/invitation/export" target="_blank"> <FontAwesomeIcon
                    icon={faDownload}/> Export</a>
            </p>

            <Modal show={this.state.addInvitationDialog} onHide={this.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add invitation</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {this.state.validationProblem !== undefined ? (
                        <div className="bp-guest-login-error">{this.state.validationProblem}</div>
                    ) : null}

                    <Form.Group as={Row}>
                        <Form.Label column sm="2">Name</Form.Label>
                        <Col sm="10">
                            <Form.Control className="textbox-outlined" value={this.state.addInvitationName} onChange={this.addInvitationNameChange} type="text" placeholder="eg. Example family" />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row}>
                        <Form.Label column sm="2">Code</Form.Label>
                        <Col sm="10">
                            <InputGroup>
                                <Form.Control className="textbox-outlined" value={this.state.addInvitationCode}
                                              onChange={this.addInvitationCodeChange} type="text" placeholder="1234"/>
                                <InputGroup.Append>
                                    <Button variant="outline-secondary" onClick={this.setCode}><FontAwesomeIcon icon={faRedo}/></Button>
                                </InputGroup.Append>
                            </InputGroup>
                        </Col>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-secondary" onClick={this.handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={this.saveInvitation}>
                        <FontAwesomeIcon icon={faPlus}/> Save
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={this.state.addPersonDialog} onHide={this.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add person</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {this.state.validationProblem !== undefined ? (
                        <div className="bp-guest-login-error">{this.state.validationProblem}</div>
                    ) : null}

                    <Form.Group as={Row}>
                        <Form.Label column sm="2">Name</Form.Label>
                        <Col sm="10">
                            <Form.Control className="textbox-outlined" value={this.state.addPersonName} onChange={this.addPersonNameChange} type="text" />
                        </Col>
                    </Form.Group>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-secondary" onClick={this.handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={this.savePerson}>
                        <FontAwesomeIcon icon={faPlus}/> Save
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    }
}

export default HostInvitationsComponent;