import React from 'react';
import { Link } from 'gatsby';

const Footer = () => {
    const currentYear = new Date().getFullYear();
    return (
        <React.Fragment>
            <div className="copyright-area three">
                <div className="container">
                    <div className="copyright-item">
                        <p>&copy;{currentYear} <Link to="/">maxmastalerz.com</Link></p>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

export default Footer