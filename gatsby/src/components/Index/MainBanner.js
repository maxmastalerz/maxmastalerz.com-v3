import React from 'react'
import { Link } from 'gatsby'

const MainBanner = ({name, desc, fb_url, tw_url, in_url, be_url, dr_url, contact_link, hire_link}) => {
    return (
        <div id="home" className="banner-area border-bottom">
            <div className="common-right-text two">
                <span>{name}</span>
            </div>

            <div className="d-table">
                <div className="d-table-cell">
                    <div className="container">
                        <div className="banner-content">
                            <h1>{name}</h1>
                            <p>{desc}</p>

                            <div className="banner-btn-area">
                                <Link to={contact_link} className="common-btn">
                                    Contact With Me
                                </Link>
                                <Link to={hire_link} className="common-btn banner-btn">
                                    Hire Me
                                </Link>
                            </div>

                            <ul>
                                <li>
                                    <Link to={fb_url}>
                                        <i className='bx bxl-facebook'></i>
                                    </Link>
                                </li>
                                <li>
                                    <Link to={tw_url}>
                                        <i className='bx bxl-twitter'></i>
                                    </Link>
                                </li>
                                <li>
                                    <Link to={in_url}>
                                        <i className='bx bxl-linkedin'></i>
                                    </Link>
                                </li>
                                <li>
                                    <Link to={be_url}>
                                        <i className='bx bxl-behance'></i>
                                    </Link>
                                </li>
                                <li>
                                    <Link to={dr_url}>
                                        <i className='bx bxl-dribbble'></i>
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MainBanner