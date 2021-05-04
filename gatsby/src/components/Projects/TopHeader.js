import React from 'react';
import { Link } from 'gatsby';

const TopHeader = () => {
    return (
        <div className="top-header">
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-lg-6">
                        <div className="logo">
                            <img src="images/logo.png" alt="Logo" />
                        </div>
                    </div>

                    <div className="col-lg-6">
                        <ul>
                            <li>
                                <Link to="#works">
                                    Works
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TopHeader;