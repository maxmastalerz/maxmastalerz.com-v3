import React from 'react'
import { Link } from 'gatsby'
import banner from '../../components/App/assets/images/banner/banner-main4.png'

const MainBanner = () => {
    return (
        <div id="home" className="banner-area five">
            <div className="d-table">
                <div className="d-table-cell">
                    <div className="container">
                        <div className="banner-content">
                            <span className="sub-head">Hey It's</span>
                            <h1>Dexia</h1>
                            <p>Hello I am a <span>Graphic Designer</span> from San Francisco</p>

                            <div className="banner-btn-area">
                                <Link to="#" className="common-btn five">
                                    Contact With Me
                                </Link>
                                <Link to="#" className="common-btn five banner-btn">
                                    Hire Me
                                </Link>
                            </div>

                            <div className="banner-img">
                                <img src={banner} alt="Banner" />
                            </div>

                            <div className="banner-social-text">
                                <ul>
                                    <li>
                                        <a href="#">FB</a>
                                    </li>
                                    <li>
                                        <a href="#">TW</a>
                                    </li>
                                    <li>
                                        <a href="#">LN</a>
                                    </li>
                                    <li>
                                        <a href="#">BE</a>
                                    </li>
                                    <li>
                                        <a href="#">DRI</a>
                                    </li>
                                    <li>
                                        <a href="#">INS</a>
                                    </li>
                                </ul>
                            </div>

                            <div className="banner-email">
                                <a href="mailto:hello@dexia.com">hello@dexia.com</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="lines">
                <div className="line"></div>
                <div className="line"></div>
                <div className="line"></div>
                <div className="line"></div>
                <div className="line"></div>
            </div>
        </div>
    )
}

export default MainBanner