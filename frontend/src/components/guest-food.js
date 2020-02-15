import React from "react";
import {Button, Col, Dropdown, Form, Modal, Row} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheckCircle, faInfoCircle, faPlus, faTrash} from "@fortawesome/free-solid-svg-icons";
import FoodTileComponent from "./food-tile";

class GuestFoodComponent extends React.Component {
    state = {
        deleteFoodDialog: false,
        addFoodRejected: false,
        addFoodError: '',
        addFoodType: undefined,
        addFoodName: '',
        addFoodDesc: '',
        cateringDialog: false,
        editFoodId: undefined,
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
        this.setState({addFoodName: newName});
    };

    addFoodDescChange = ev => {
        let newDesc = ev.currentTarget.value;
        this.setState({addFoodDesc: newDesc});

    };

    foodClosed = async ev => {
        this.setState({
            addFoodDialog: false,
        });
    };

    deleteFoodClosed = async ev => {
        this.setState({
            deleteFoodDialog: false,
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

    handleRemove(e, food) {
        this.setState({
            deleteFoodDialog: true,
            editFoodId: food.id,
            addFoodName: food.name
        })
    }

    deleteConfirmed = async ev => {
        console.log("Removing dish");
        await fetch('/api/dish/' + this.state.editFoodId, {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({confirm: true})
        }).then(async res =>  {
            await this.refreshFood();
            this.setState({
                deleteFoodDialog: false
            });
        }).catch(res => {
            this.setState({
                deleteFoodDialog: true,
                addFoodError: 'Failed',
            });
        });
    };

    editFoodClosed = ev => {
        console.log("Dish edit cancelled");
        this.setState({
            editFoodDialog: false
        })
    };

    saveEditFood = async ev => {
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
        await fetch('/api/dish/' + this.state.editFoodId, {
            method: 'PUT',
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
                editFoodDialog: false
            });
        }).catch(res => {
            this.setState({
                addFoodRejected: true,
                addFoodError: 'Failed',
            });
        });
    };

    async handleEdit(e, food) {
        /* Load this dish info into some variables */
        console.log("Editing dish", food.name);
        let allergen = await fetch('/api/allergen/').then(res => res.json());
        let special_preparation = await fetch('/api/preparation/').then(res => res.json());
        // Check some boxes
        let allergen_ids = food.allergens.map(x => x.id);
        let special_preparation_ids = food.special_preparations.map(x => x.id);
        allergen.items.forEach(function(part, index, items) {
            items[index].value = allergen_ids.includes(part.id) ? true: undefined;
        });
        special_preparation.items.forEach(function(part, index, items) {
            items[index].value = special_preparation_ids.includes(part.id) ? true: undefined;
        });
        this.setState({
            editFoodId: food.id,
            editFoodDialog: true,
            allergen: allergen.items,
            special_preparation: special_preparation.items,
            addFoodType: food.dish_type,
            addFoodName: food.name,
            addFoodDesc: food.desc,
            addFoodRejected: false,
            addFoodError: '',
        })
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
            <Modal size="lg" show={this.state.editFoodDialog} onHide={this.editFoodClosed}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit {this.state.addFoodName}</Modal.Title>
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
                            <Form.Control className="textbox-outlined" value={this.state.addFoodName} onChange={this.addFoodNameChange} type="text" placeholder="eg. Spaghetti Carbonara" />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row}>
                        <Form.Label column sm="2">Description</Form.Label>
                        <Col sm="10">
                            <Form.Control className="textbox-outlined" value={this.state.addFoodDesc} onChange={this.addFoodDescChange} type="text" placeholder="eg. Creamy pasta with bacon"/>
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
                    <Button variant="outline-secondary" onClick={this.editFoodClosed}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={this.saveEditFood}>
                        <FontAwesomeIcon icon={faCheckCircle}/> Save
                    </Button>
                </Modal.Footer>
            </Modal>





















            <Modal show={this.state.deleteFoodDialog} onHide={this.deleteFoodClosed}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete {this.state.addFoodName}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {this.state.addFoodRejected ? (
                        <div className="bp-guest-login-error">{this.state.addFoodError}</div>
                    ) : null}

                        <p>Are you sure?</p>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-secondary" onClick={this.deleteFoodClosed}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={this.deleteConfirmed}>
                        <FontAwesomeIcon icon={faTrash}/> Delete
                    </Button>
                </Modal.Footer>
            </Modal>














        </div>
    }
}

export default GuestFoodComponent;
