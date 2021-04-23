import React from 'react'
import { Link } from 'gatsby'
import service1 from '../../components/App/assets/images/services/service1.jpg'
import service2 from '../../components/App/assets/images/services/service2.jpg'
import service3 from '../../components/App/assets/images/services/service3.jpg'
import service4 from '../../components/App/assets/images/services/service4.jpg'
import service5 from '../../components/App/assets/images/services/service5.jpg'
import service6 from '../../components/App/assets/images/services/service6.jpg'

const Services = () => {
    return (
        <div className="what-area six pb-70">
            <div className="container">
                <div className="section-title six">
                    <span className="sub-title">SERVICES</span>
                    <h2>The <span>Services</span> That I Provide For My Client's Ultimate Satisfaction</h2>
                </div>

                <div className="row">
                    <div className="col-sm-6 col-lg-4">
                        <div className="what-item">
                            <img src={service1} alt="Service" />
                            <h3>
                                <Link to="/service-details">
                                    Wedding Photography
                                </Link>
                            </h3>
                            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore animi praesentium tenetur earum accusantium</p>

                            <Link to="/service-details" className="what-btn">
                                Explore More <i className="flaticon-right-arrow"></i>
                            </Link>
                        </div>
                    </div>

                    <div className="col-sm-6 col-lg-4">
                        <div className="what-item">
                            <img src={service2} alt="Service" />
                            <h3>
                                <Link to="/service-details">
                                    Personal Photography
                                </Link>
                            </h3>
                            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore animi praesentium tenetur earum accusantium</p>
                            
                            <Link to="/service-details" className="what-btn">
                                Explore More <i className="flaticon-right-arrow"></i>
                            </Link>
                        </div>
                    </div>

                    <div className="col-sm-6 col-lg-4">
                        <div className="what-item">
                            <img src={service3} alt="Service" />
                            <h3>
                                <Link to="/service-details">
                                    Pre-wedding Photography
                                </Link>
                            </h3>
                            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore animi praesentium tenetur earum accusantium</p>
                            
                            <Link to="/service-details" className="what-btn">
                                Explore More <i className="flaticon-right-arrow"></i>
                            </Link>
                        </div>
                    </div>

                    <div className="col-sm-6 col-lg-4">
                        <div className="what-item">
                            <img src={service4} alt="Service" />
                            <h3>
                                <Link to="/service-details">
                                    Commercial Photography
                                </Link>
                            </h3>
                            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore animi praesentium tenetur earum accusantium</p>
                            
                            <Link to="/service-details" className="what-btn">
                                Explore More <i className="flaticon-right-arrow"></i>
                            </Link>
                        </div>
                    </div>

                    <div className="col-sm-6 col-lg-4">
                        <div className="what-item">
                            <img src={service5} alt="Service" />
                            <h3>
                                <Link to="/service-details">
                                    Travel Photography
                                </Link>
                            </h3>
                            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore animi praesentium tenetur earum accusantium</p>
                            
                            <Link to="/service-details" className="what-btn">
                                Explore More <i className="flaticon-right-arrow"></i>
                            </Link>
                        </div>
                    </div>

                    <div className="col-sm-6 col-lg-4">
                        <div className="what-item">
                            <img src={service6} alt="Service" />
                            <h3>
                                <Link to="/service-details">
                                    Nature Photography
                                </Link>
                            </h3>
                            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore animi praesentium tenetur earum accusantium</p>
                            
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