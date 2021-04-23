import React from 'react'
import {Link} from 'gatsby'
import mainBanner from '../../components/App/assets/images/banner/banner-main2.png'

const MainBanner = () => {
    return (
        <div id="home" className="banner-area-two">
            <div className="banner-shape-img">
                <img src={mainBanner} alt="Shape" />
            </div>

            <div className="d-table">
                <div className="d-table-cell">
                    <div className="container">

                        <div className="banner-content">
                            <span>Welcome To</span>
                            <h1>Reton's World</h1>
                            <Link to="#" className="common-btn two">
                                Start A Project
                            </Link>

                            <ul>
                                <li>
                                    <a href="#">
                                        <i className='bx bxl-facebook'></i>
                                    </a>
                                </li>
                                <li>
                                    <a href="#">
                                        <i className='bx bxl-twitter'></i>
                                    </a>
                                </li>
                                <li>
                                    <a href="#">
                                        <i className='bx bxl-linkedin'></i>
                                    </a>
                                </li>
                                <li>
                                    <a href="#">
                                        <i className='bx bxl-behance'></i>
                                    </a>
                                </li>
                                <li>
                                    <a href="#">
                                        <i className='bx bxl-dribbble'></i>
                                    </a>
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