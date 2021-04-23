import React from 'react'
import {Link} from 'gatsby'

const Services = () => {
    return (
        <div className="what-area three border-bottom-two pt-100 pb-70">
            <div className="container">
                <div className="section-title three">
                    <span className="sub-title">SERVICES</span>
                    <h2>I Offer Special Service To My Client For Their Ultimate Satisfaction</h2>
                    <p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, seddiam voluptua. At vero eos et accusam et.</p>
                </div>

                <div className="row">
                    <div className="col-sm-6 col-lg-6">
                        <div className="what-item">
                            <i className="flaticon-global icon"></i>
                            <h3>
                                <Link to="/service-details">
                                    Web Design
                                </Link>
                            </h3>
                            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum assumenda at doloribus dolore quae quibusdam</p>

                            <Link to="/service-details" className="what-btn">
                                Explore More <i className="flaticon-right-arrow"></i>
                            </Link>
                        </div>
                    </div>

                    <div className="col-sm-6 col-lg-6">
                        <div className="what-item">
                            <i className="flaticon-smartphone icon"></i>
                            <h3>
                                <Link to="/service-details">
                                    App Design
                                </Link>
                            </h3>
                            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum assumenda at doloribus dolore quae quibusdam</p>
                            
                            <Link to="/service-details"className="what-btn">
                                Explore More <i className="flaticon-right-arrow"></i>
                            </Link>
                        </div>
                    </div>

                    <div className="col-sm-6 col-lg-6">
                        <div className="what-item">
                            <i className="flaticon-paintbrush icon"></i>
                            <h3>
                                <Link to="/service-details">
                                    Illustration
                                </Link>
                            </h3>
                            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum assumenda at doloribus dolore quae quibusdam</p>
                            
                            <Link to="/service-details" className="what-btn">
                                Explore More <i className="flaticon-right-arrow"></i>
                            </Link>
                        </div>
                    </div>

                    <div className="col-sm-6 col-lg-6">
                        <div className="what-item">
                            <i className="flaticon-branding icon"></i>
                            <h3>
                                <Link to="/service-details">
                                    Branding
                                </Link>
                            </h3>
                            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum assumenda at doloribus dolore quae quibusdam</p>
                            
                            <Link to="/service-details" className="what-btn">
                                Explore More <i className="flaticon-right-arrow"></i>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Services