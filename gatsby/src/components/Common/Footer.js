import React from 'react';
import { Link } from 'gatsby';
import blueRibbonStrip from '../../assets/images/brstrip.webp';
import buttonIpv6Small from '../../assets/images/button-ipv6-small.webp';

const Footer = () => {
    const currentYear = new Date().getFullYear();
    return (
        <React.Fragment>
            <div className="copyright-area three">
                <div className="container">
                    <div className="copyright-item">
                        <p className="mb-3">&copy;{currentYear} <Link to="/">maxmastalerz.com</Link></p>
                        <a href="https://www.eff.org/pages/blue-ribbon-campaign" className="mx-2">
                            <img src={blueRibbonStrip} alt="Join the Blue Ribbon Online Free Speech Campaign" width="150" height="41"/>
                        </a>
                        <a href="https://ipv6-test.com/validate.php?url=https://maxmastalerz.com" className="mx-2">
                            <img src={buttonIpv6Small} alt="ipv6 ready" title="ipv6 ready" border="0" width="88" height="31"/>
                        </a>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

export default Footer