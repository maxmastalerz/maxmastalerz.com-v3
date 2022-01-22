import React from 'react'
import { Link } from 'gatsby'

const TopHeader = (props) => {
    return (
        <div className="top-header">
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-6">
                        <div className="logo">
                            <Link to="/">
                                <div className="site-logo">
                                    <span>MM</span><div></div><div></div>
                                </div>
                            </Link>
                        </div>
                    </div>

                    <div className="col-6">
                        <ul>
                            <li>
                                <Link to="/">
                                    Home
                                </Link>
                            </li>
                            {props.seondLinkName && (
                                <li>
                                    <Link to={props.secondLinkUrl ? props.secondLinkUrl : "#"}>
                                        {props.seondLinkName}
                                    </Link>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TopHeader