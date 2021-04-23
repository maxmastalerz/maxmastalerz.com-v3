import React from 'react'
import { Link } from 'gatsby'
import bannerImg from '../../components/App/assets/images/banner/banner-main3.png'

const MainBanner = () => {
    return (
        <div id="home" className="banner-area four">
            <div className="banner-img">
                <img src={bannerImg} alt="Image" />
            </div>

            <div className="d-table">
                <div className="d-table-cell">
                    <div className="container">
                        <div className="banner-content">
                            <span className="sub-head">Hey It's</span>
                            <h1>Dexia Milano</h1>
                            <p>Hello I am a <span>Graphic Designer</span> from San Francisco. I have rich experience of 5+ years in Logo design and Flyer design</p>
                            
                            <div className="banner-btn-area">
                                <Link to="#" className="common-btn">
                                    Contact With Me
                                </Link>
                                <Link href="#" className="common-btn banner-btn">
                                    Hire Me
                                </Link>
                            </div>

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