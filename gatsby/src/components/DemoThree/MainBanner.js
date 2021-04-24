import React from 'react';
import {Link} from 'gatsby';
import AnchorLink from 'react-anchor-link-smooth-scroll';

const MainBanner = () => {
    return (
        <div id="home" className="banner-area border-bottom-two three">
            <div className="common-right-text-two">
                <span>Max <br /> Mastalerz <br /> SOFTWARE <br /> ENGINEER <br /> FULL STACK <br /> DEVELOPER</span>
            </div>
            
            <div className="d-table">
                <div className="d-table-cell">
                    <div className="container">
                        <div className="banner-content">
                            <h1><span>Max</span> Mastalerz</h1>
                            <p>Hello and welcome to my site! I'm a new graduate and <span>Software Engineer/Developer</span>. If you need a hand creating highly scaleable and robust software you've come to the right place.</p>

                            <div className="banner-btn-area">
                                <AnchorLink className="common-btn three" href="#contact">
                                    Contact Me
                                </AnchorLink>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MainBanner