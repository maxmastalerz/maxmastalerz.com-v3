import React from 'react'
import {Link} from 'gatsby'

const Services = () => {
    return (
        <div id="services" className="what-area three border-bottom-two pt-100 pb-70">
            <div className="container">
                <div className="section-title three">
                    <span className="sub-title">SERVICES</span>
                    <h2>What Does Your Project, Team, or Company Need?</h2>
                    <p>I have experience in many different areas. Let's narrow down your search.</p>
                </div>

                <div className="row">
                    <div className="col-sm-6 col-lg-6 mb-4">
                        <div className="what-item">
                            <i className='bx bx-globe icon'></i>
                            <h3>
                                <Link to="/service-details">
                                    Frontend / Backend Web Development
                                </Link>
                            </h3>
                            <p>Responsive, Accessible, & Search-Optimized design. Your backend will also be secure and extendable.</p>

                            <Link to="/service-details" className="what-btn">
                                Learn More <i className="flaticon-right-arrow"></i>
                            </Link>
                        </div>
                    </div>

                    <div className="col-sm-6 col-lg-6 mb-4">
                        <div className="what-item">
                            <i className='bx bx-mobile icon'></i>
                            <h3>
                                <Link to="/service-details">
                                    App Development & Design
                                </Link>
                            </h3>
                            <p>Android and iOS compatible apps! Built using Cross-Platform or Hybrid approaches. (React Native / Cordova / PhoneGap)</p>
                            
                            <Link to="/service-details"className="what-btn">
                                Learn More <i className="flaticon-right-arrow"></i>
                            </Link>
                        </div>
                    </div>
                    <div className="col-sm-6 col-lg-6 mb-4">
                        <div className="what-item">
                            <i className='bx bx-desktop icon'></i>
                            <h3>
                                <Link to="/service-details">
                                    Desktop Applications
                                </Link>
                            </h3>
                            <p>A desktop app may be best suited for your needs. Let me know what you're looking for and I can help make it happen.</p>
                            
                            <Link to="/service-details" className="what-btn">
                                Learn More <i className="flaticon-right-arrow"></i>
                            </Link>
                        </div>
                    </div>

                    <div className="col-sm-6 col-lg-6 mb-4">
                        <div className="what-item">
                            <i className='bx bx-dots-horizontal-rounded icon'></i>
                            <h3>
                                <Link to="/service-details">
                                    Other
                                </Link>
                            </h3>
                            <p>Programming a microcontroller or working with integrated circuits? Maybe you're looking for someone to fill a DevOps role? Let's get in touch.</p>
                            
                            <Link to="/service-details" className="what-btn">
                                Learn More <i className="flaticon-right-arrow"></i>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Services