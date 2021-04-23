import React from 'react'
import {Link} from 'gatsby'
import gallery1 from '../../components/App/assets/images/gallery/gallery1.jpg'
import gallery2 from '../../components/App/assets/images/gallery/gallery2.jpg'
import gallery3 from '../../components/App/assets/images/gallery/gallery3.jpg'
import gallery4 from '../../components/App/assets/images/gallery/gallery4.jpg'
import gallery5 from '../../components/App/assets/images/gallery/gallery5.jpg'

const Gallery = () => {
    return (
        <div id="portfolio" className="gallery-area pb-100">
            <div className="container">
                <div className="section-title two">
                    <span className="sub-title">GALLERY</span>
                    <h2>Here Are Some Of My <span>Creation</span> Which Amazed People By Heart</h2>
                </div>

                <div className="row">
                    <div className="col-sm-6 col-lg-6">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="gallery-item">
                                    <img src={gallery1} alt="Gallery" />
                                    <div className="inner">
                                        <h3>
                                            <Link to="#">
                                                Blue Heart
                                            </Link>
                                        </h3>
                                        <span>Creative</span>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-6">
                                <div className="gallery-item">
                                    <img src={gallery4} alt="Gallery" />
                                    <div className="inner">
                                        <h3>
                                            <Link to="#">
                                                Wind Color
                                            </Link>
                                        </h3>
                                        <span>Thriller</span>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-6">
                                <div className="gallery-item">
                                    <img src={gallery5} alt="Gallery" />
                                    <div className="inner">
                                        <h3>
                                            <Link to="#">
                                                Life's Color
                                            </Link>
                                        </h3>
                                        <span>Romantic</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-sm-6 col-lg-6">
                        <div className="row">
                            <div className="col-lg-6">
                                <div className="gallery-item">
                                    <img src={gallery2} alt="Gallery" />
                                    <div className="inner">
                                        <h3>
                                            <Link to="#">
                                                Mind Color
                                            </Link>
                                        </h3>
                                        <span>Thriller</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="col-lg-6">
                                <div className="gallery-item">
                                    <img src={gallery3} alt="Gallery" />
                                    <div className="inner">
                                        <h3>
                                            <Link to="#">
                                                Heart Touch
                                            </Link>
                                        </h3>
                                        <span>Romantic</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="text-center">
                    <Link to="#" className="common-btn two">
                        See Full Gallery
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Gallery