import React from 'react'
import {Link} from 'gatsby'

const MainBanner = () => {
    return (
        <div id="home" className="banner-area border-bottom-two three">
            <div className="common-right-text-two">
                <span>Max <br /> Mastalerz <br /> HIGHLY <br /> EXPERIENCED <br /> WEB <br /> DEVELOPER</span>
            </div>
            
            <div className="d-table">
                <div className="d-table-cell">
                    <div className="container">
                        <div className="banner-content">
                            <h1><span>Max</span> Mastalerz</h1>
                            <p>Hello and welcome to my site! I'm a new graduate and <span>Software Engineer/Developer</span>. If you need a hand creating highly scaleable and robust apps you've come to the right place.</p>

                            <div className="banner-btn-area">
                                <Link to="#" className="common-btn three">
                                    Contact With Me
                                </Link>
                                <Link to="#" className="common-btn banner-btn three">
                                    Hire Me
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MainBanner