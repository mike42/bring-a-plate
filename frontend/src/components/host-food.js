import * as React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faDownload} from "@fortawesome/free-solid-svg-icons";

class HostFoodComponent extends React.Component {
    render() {
        return <div>
            <p>This will export the list of food to a spreadsheet.</p>

            <p style={{marginBottom: '4rem'}}>
                <a className="btn btn-outline-secondary" href="/api/dish/export" target="_blank"> <FontAwesomeIcon
                    icon={faDownload}/> Export</a>
            </p>
        </div>
    }
}

export default HostFoodComponent;