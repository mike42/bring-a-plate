import React from "react";

function PageFooter() {
    return <div className="bp-foot-outer">
        <div className="container">
            <div className="row bp-foot">
                <div className="bp-foot-inner">
                    <div className="foot-left">
                        <img className="bp-foot-img" src={process.env.PUBLIC_URL + '/logo-white.svg'}
                             alt={"Bring a plate"}/>
                    </div>
                    <div className="foot-right">
                        Bring a Plate
                    </div>
                </div>
            </div>
        </div>
    </div>
}

export default PageFooter;
