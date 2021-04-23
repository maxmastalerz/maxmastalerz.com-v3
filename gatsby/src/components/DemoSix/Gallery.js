import React from 'react'
import { Link } from 'gatsby'
import gallery6 from '../../components/App/assets/images/gallery/gallery6.jpg'
import gallery7 from '../../components/App/assets/images/gallery/gallery7.jpg'
import gallery8 from '../../components/App/assets/images/gallery/gallery8.jpg'
import gallery9 from '../../components/App/assets/images/gallery/gallery9.jpg'
import gallery10 from '../../components/App/assets/images/gallery/gallery10.jpg'
import gallery11 from '../../components/App/assets/images/gallery/gallery11.jpg'

const Gallery = () => {
    return (
        <div id="portfolio" className="creation-area pb-100">
            <div className="container">
                <div className="section-title six">
                    <span className="sub-title">GALLERY</span>
                    <h2>Here Are Some Of My <span>Creation</span> Which Amazed People By Heart</h2>
                </div>

                <div className="row">
                    <div className="col-sm-6 col-lg-4">
                        <div className="creation-item">
                            <img src={gallery6} alt="Gallery" />
                            <div className="inner">
                                <span>WEDDING PHOTO</span>
                                <h3>
                                    <Link to="#">
                                        Jenny's Wedding
                                    </Link>
                                </h3>
                            </div>
                        </div>
                        <div className="creation-item">
                            <img src={gallery7} alt="Gallery" />
                            <div className="inner">
                                <span>TRAVEL</span>
                                <h3>
                                    <Link to="#">
                                        Travel On Caravan
                                    </Link>
                                </h3>
                            </div>
                        </div>
                    </div>

                    <div className="col-sm-6 col-lg-4">
                        <div className="creation-item">
                            <img src={gallery8} alt="Gallery" />
                            <div className="inner">
                                <span>NATURE</span>
                                <h3>
                                    <Link to="#">
                                        Life On Boat
                                    </Link>
                                </h3>
                            </div>
                        </div>
                        <div className="creation-item">
                            <img src={gallery9} alt="Gallery" />
                            <div className="inner">
                                <span>Personal Photography</span>
                                <h3>
                                    <Link to="#">
                                        Girl Wedding Hat
                                    </Link>
                                </h3>
                            </div>
                        </div>
                    </div>

                    <div className="col-sm-6 offset-sm-3 offset-lg-0 col-lg-4">
                        <div className="creation-item">
                            <img src={gallery10} alt="Gallery" />
                            <div className="inner">
                                <span>COMMERCIAL SHOOT</span>
                                <h3>
                                    <Link to="#">
                                        Crazy Bike
                                    </Link>
                                </h3>
                            </div>
                        </div>
                        <div className="creation-item">
                            <img src={gallery11} alt="Gallery" />
                            <div className="inner">
                                <span>LOVE STORY</span>
                                <h3>
                                    <Link to="#">
                                        Love Met
                                    </Link>
                                </h3>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="text-center">
                    <Link to="#" className="common-btn six">
                        Explore Portfolio
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Gallery