import React from 'react'
import { Link } from 'gatsby'
import logo from '../../assets/images/logo.png';

const TopHeader = (props) => {
    return (
        <div className="top-header">
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-6">
                        <div className="logo">
                            <Link to="/">
                                <img src={logo} alt="Logo" />
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