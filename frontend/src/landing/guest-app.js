import React from "react";
import {useUser} from "../context/user-context";
import {useAuth} from "../context/auth-context";
import PageFooter from "../components/page-footer";
import {Button, ButtonGroup, Col, Dropdown, Form, Modal, Row} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faInfoCircle, faPlus, faUtensils} from "@fortawesome/free-solid-svg-icons";
import FoodTileComponent from "../components/food-tile";

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

class GuestFoodComponent extends React.Component {
    state = {
        addFoodRejected: false,
        addFoodError: '',
        addFoodType: undefined,
        addFoodName: '',
        addFoodDesc: '',
        cateringDialog: false,
        allergen: [],
        special_preparation: [],
        food: {
            main: [],
            salads: [],
            desserts: []
        },
        cateringInfo: {
            allergen: [],
            special_preparation: []
        },
    };

    componentDidMount() {
        this.refreshFood();
    }

    cateringInfo = async ev => {
        console.log("Fetching catering info")
        let result = await fetch('/api/invitation/' + this.props.user.id + '/catering')
            .then(res => res.json());
        this.setState({cateringDialog: true, cateringInfo: result});
    };

    refreshFood = async ev => {
        let result = await fetch('/api/dish/')
            .then(res => res.json());
        this.setState({
            food: {
                main: result.items.filter(x => x.dish_type === 'FoodType.MAIN'),
                salads: result.items.filter(x => x.dish_type === 'FoodType.SALAD'),
                desserts: result.items.filter(x => x.dish_type === 'FoodType.DESSERT')
            }
        });
    };

    addFood = async ev => {
        let allergen = await fetch('/api/allergen/').then(res => res.json());
        let special_preparation = await fetch('/api/preparation/').then(res => res.json());
        this.setState({
            addFoodDialog: true,
            allergen: allergen.items,
            special_preparation: special_preparation.items,
            addFoodName: '',
            addFoodDesc: '',
            addFoodType: undefined,
            addFoodRejected: false,
            addFoodError: '',
        });
    };

    addFoodReqChange = ev => {
        let idx = Number(ev.currentTarget.id.match(/\d+$/)[0]);
        console.log("Dietary requirement number " + idx + " changed");
        const newReq = this.state.special_preparation;
        newReq[idx].value = newReq[idx].value === undefined ? true : undefined;
        this.setState({special_preparation: newReq});
    };

    addFoodAllergenChange = ev => {
        let idx = Number(ev.currentTarget.id.match(/\d+$/)[0]);
        console.log("Allergen number " + idx + " changed");
        const newReq = this.state.allergen;
        newReq[idx].value = newReq[idx].value === undefined ? true : undefined;
        this.setState({allergen: newReq});
    };

    addFoodTypeChange = ev => {
        console.log("food type changed", ev);
        this.setState({addFoodType: ev});
    };

    addFoodNameChange = ev => {
        let newName = ev.currentTarget.value;
        console.log("food name changed", newName);
        this.setState({addFoodName: newName});
    };

    addFoodDescChange = ev => {
        let newDesc = ev.currentTarget.value;
        console.log("food desc changed", newDesc);
        this.setState({addFoodDesc: newDesc});

    };

    foodClosed = async ev => {
        this.setState({
            addFoodDialog: false,
        });
    };

    saveFood = async ev => {
        if(this.state.addFoodName === '' || this.state.addFoodType === undefined) {
            this.setState({
                addFoodRejected: true,
                addFoodError: 'Some required fields are not complete'
            });
            return;
        }
        let filtered_allergens = this.state.allergen.filter(x => x.value !== undefined).map(x => {
            return {
                id: x.id,
                name: x.name
            }
        });
        let filtered_preparations = this.state.special_preparation.filter(x => x.value !== undefined).map(x => {
            return {
                id: x.id,
                name: x.name
            }
        });
        await fetch('/api/dish/', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                name: this.state.addFoodName,
                dish_type: this.state.addFoodType,
                desc: this.state.addFoodDesc,
                allergens: filtered_allergens,
                special_preparations: filtered_preparations,
                invitation_id: this.props.user.id
            })
        }).then(async res =>  {
            await this.refreshFood();
            this.setState({
                addFoodDialog: false
            });
        }).catch(res => {
            this.setState({
                addFoodRejected: true,
                addFoodError: 'Failed',
            });
        });
    };

    handleClose = ev => {
        this.setState({
            cateringDialog: false
        });
    };

    async handleRemove(e, food) {
        console.log("Removing dish");
        await fetch('/api/dish/' + food.id, {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({confirm: true})
        });
        await this.refreshFood();
    }

    handleEdit(e, food) {

    }

    render() {
        return <div>
            <p>
                <Button variant="outline-secondary" onClick={this.addFood}><FontAwesomeIcon icon={faPlus}/> Add
                    food</Button>
                &nbsp;
                <Button variant="outline-secondary" onClick={this.cateringInfo}><FontAwesomeIcon
                    icon={faInfoCircle}/> Dietary requirements</Button>
            </p>

            <div className="card mb-3">
                <div className="card-header d-flex justify-content-between align-items-center">
                    Mains
                    <span className="badge badge-secondary badge-pill">{this.state.food.main.length}</span>
                </div>
                <div className="list-group list-group-flush">
                    {this.state.food.main.length === 0 &&
                    <div className="list-group-item">
                        No mains.
                    </div>
                    }
                    {this.state.food.main.map((food, idx) => (
                        <FoodTileComponent key={idx} food={food} user={this.props.user} onEdit={(e) => this.handleEdit(e, food)} onRemove={(e) => this.handleRemove(e, food)}/>
                    ))}
                </div>
            </div>

            <div className="card mb-3">
                <div className="card-header d-flex justify-content-between align-items-center">
                    Salads
                    <span className="badge badge-secondary badge-pill">{this.state.food.salads.length}</span>
                </div>
                <div className="list-group list-group-flush">
                    {this.state.food.salads.length === 0 &&
                    <div className="list-group-item">
                        No salads.
                    </div>
                    }
                    {this.state.food.salads.map((food, idx) => (
                        <FoodTileComponent key={idx} food={food} user={this.props.user} onEdit={(e) => this.handleEdit(e, food)} onRemove={(e) => this.handleRemove(e, food)}/>
                    ))}
                </div>
            </div>

            <div className="card mb-3">
                <div className="card-header d-flex justify-content-between align-items-center">
                    Desserts
                    <span className="badge badge-secondary badge-pill">{this.state.food.desserts.length}</span>
                </div>

                <div className="list-group list-group-flush">
                    {this.state.food.desserts.length === 0 &&
                        <div className="list-group-item">
                            No desserts.
                        </div>
                    }
                    {this.state.food.desserts.map((food, idx) => (
                        <FoodTileComponent key={idx} food={food} user={this.props.user} onEdit={(e) => this.handleEdit(e, food)} onRemove={(e) => this.handleRemove(e, food)}/>
                    ))}
                </div>
            </div>
            <Modal size="lg" show={this.state.cateringDialog} onHide={this.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Special catering</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="row">
                        <div className="col-sm-6">
                            <h5>Allergies</h5>
                            <table className="table">
                                <thead>
                                <tr>
                                    <th>Allergy</th>
                                    <th>People</th>
                                </tr>
                                </thead>
                                <tbody>
                                {this.state.cateringInfo.allergen.map((allergen, idx) => (
                                    <tr key={idx} className="bp-checkbox-item">
                                        <td>{allergen.name}</td>
                                        <td>{allergen.count > 0 ? allergen.count : '–'}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="col-sm-6">
                            <h5>Special preparation</h5>

                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Requirement</th>
                                        <th>People</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {this.state.cateringInfo.special_preparation.map((prep, idx) => (
                                    <tr key={idx} className="bp-checkbox-item">
                                        <td>{prep.name}</td>
                                        <td>{prep.count > 0 ? prep.count : '–'}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={this.handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal size="lg" show={this.state.addFoodDialog} onHide={this.foodClosed}>
                <Modal.Header closeButton>
                    <Modal.Title>Add food</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {this.state.addFoodRejected ? (
                        <div className="bp-guest-login-error">{this.state.addFoodError}</div>
                    ) : null}
                    <Form.Group as={Row}>
                        <Form.Label column sm="2">Type</Form.Label>
                        <Col sm="10">
                            <Dropdown>
                                <Dropdown.Toggle variant="outline-secondary">
                                    {this.state.addFoodType === undefined ? 'Please select' : ''}
                                    {this.state.addFoodType === 'FoodType.MAIN' ? 'Main' : ''}
                                    {this.state.addFoodType === 'FoodType.SALAD' ? 'Salad' : ''}
                                    {this.state.addFoodType === 'FoodType.DESSERT' ? 'Dessert' : ''}
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item onSelect={this.addFoodTypeChange} eventKey="FoodType.MAIN">Main</Dropdown.Item>
                                    <Dropdown.Item onSelect={this.addFoodTypeChange} eventKey="FoodType.SALAD">Salad</Dropdown.Item>
                                    <Dropdown.Item onSelect={this.addFoodTypeChange} eventKey="FoodType.DESSERT">Dessert</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row}>
                        <Form.Label column sm="2">Name</Form.Label>
                        <Col sm="10">
                            <Form.Control className="textbox-outlined" onChange={this.addFoodNameChange} type="text" placeholder="eg. Spaghetti Carbonara" />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row}>
                        <Form.Label column sm="2">Description</Form.Label>
                        <Col sm="10">
                            <Form.Control className="textbox-outlined" onChange={this.addFoodDescChange} type="text" placeholder="eg. Creamy pasta with bacon"/>
                        </Col>
                    </Form.Group>

                    <p>Contains:</p>
                    <div className="bp-checkbox-row">
                        {this.state.allergen.map((allergen, idx) => (
                            <div key={idx} className="bp-checkbox-item">
                                <Form.Group controlId={'add-food-allergen-check-' + idx}>
                                    <Form.Check type="checkbox" label={allergen.name} checked={allergen.value !== undefined}
                                                onChange={this.addFoodAllergenChange}/>
                                </Form.Group>
                            </div>
                        ))}
                    </div>
                    <p>I am preparing this to be:</p>
                    <div className="bp-checkbox-row">
                        {this.state.special_preparation.map((prep, idx) => (
                            <div key={idx} className="bp-checkbox-item">
                                <Form.Group controlId={'special-prep-check-' + idx}>
                                    <Form.Check type="checkbox" label={prep.name} checked={prep.value !== undefined}
                                                onChange={this.addFoodReqChange}/>
                                </Form.Group>
                            </div>
                        ))}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-secondary" onClick={this.foodClosed}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={this.saveFood}>
                        <FontAwesomeIcon icon={faPlus}/> Save
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    }
}

function GuestApp() {
    const user = useUser();
    const {logout} = useAuth();
    return <div className="bp-authenticated">
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
                <GuestFoodComponent user={user}/>

                <h3>All done!</h3>

                <p>Click the button below when you are ready to log out.</p>

                {/* eslint-disable-next-line */}
                <a className="btn btn-primary" href="#" onClick={logout}>Log out</a>
            </div>
        </div>

        <PageFooter/>
    </div>;
}

export default GuestApp;