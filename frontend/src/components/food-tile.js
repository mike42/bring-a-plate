import React from "react";
import {Button, ButtonGroup} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit, faTrash} from "@fortawesome/free-solid-svg-icons";

class FoodTileComponent extends React.Component {
    static defaultProps = {
        onEdit: (e) => {console.log("No edit event defined")},
        onRemove: (e) => {console.log("No remove event defined")},
    };

    render() {
        return <div href="#" className="list-group-item flex-column align-items-start">
            <div className="d-flex w-100 justify-content-between">
                <div>
                    <h5 className="mb-1">{this.props.food.name}
                        {this.props.food.special_preparations.map((prep, idx) => (
                            <span key={idx}>
                           &nbsp;
                                <span className="badge badge-success">{prep.name}</span>
                        </span>
                        ))}
                    </h5>
                    <p className="mb-1">{this.props.food.desc}</p>
                </div>
                {this.props.food.invitation_id === this.props.user.id &&
                <div className="mb-1">
                    <ButtonGroup>
                        <Button variant="outline-danger" size="sm" onClick={(e) => this.props.onRemove(e)}><FontAwesomeIcon icon={faTrash}/> Remove</Button>
                        <Button variant="outline-secondary" size="sm" onClick={(e) => this.props.onEdit(e)}><FontAwesomeIcon icon={faEdit}/> Edit</Button>
                    </ButtonGroup>
                </div>
                }
            </div>

            <small>Allergens:&nbsp;
                {this.props.food.allergens.length === 0 ? 'None listed': ''}
                {this.props.food.allergens.map((allergen, idx) => (
                    <span key={idx}>{allergen.name}
                        {idx < this.props.food.allergens.length - 1 ? ', ' : ''}
                    </span>
                ))}</small>
        </div>
    }
}

export default FoodTileComponent;
