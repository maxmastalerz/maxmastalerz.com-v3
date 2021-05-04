import React, { useEffect } from 'react';
import useScript from 'react-script-hook';
import TopHeader from '../components/Projects/TopHeader';
import PageBanner from '../components/Common/PageBanner';
import Footer from '../components/Projects/Footer'; 
import { Link } from 'gatsby';

const Projects = () => {
    const [loadingMasonry, ] = useScript({ src: 'masonry.pkgd.min.js' });
    const [loadingImagesLoaded, ] = useScript({ src: 'imagesloaded.pkgd.min.js'});

    useEffect(() => {
        if(loadingImagesLoaded || loadingMasonry) { //If still loading js libraries, skip
            return;
        }
        
        var grid = document.querySelector('.grid');
        
        var msnry = new window.Masonry( grid, {
            columnWidth: ".grid-sizer",
            itemSelector: ".grid-item",
            percentPosition: "true",
            gutter: 30
        });

        window.imagesLoaded( grid ).on( 'progress', function() {
            msnry.layout();
        });
    }, [loadingImagesLoaded, loadingMasonry]);

    return (
        <React.Fragment>  
            <TopHeader />
            <PageBanner 
                bgText="Projects" 
                pageTitle="Projects" 
                homePageUrl="/" 
                homePageText="Home" 
                activePageText="Projects" 
            /> 

            <div className="container">
                <div className="masonry-lg work-area pt-100 pb-70">
                    <div className="grid">
                        <div className="grid-sizer"></div>
                        <div className="grid-item">
                            <div className="overlay">
                                <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/82/orange-tree.jpg" alt="Work"/>
                                <div className="inner">
                                    <h3>
                                        <Link to="/work-details" target="_blank" rel="noopener noreferrer">
                                            Pancake Logo
                                        </Link>
                                    </h3>
                                </div>
                            </div>
                        </div>
                        <div className="grid-item">
                            <div className="overlay">
                                <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/82/submerged.jpg" alt="Work"/>
                                <div className="inner">
                                    <h3>
                                        <Link to="/work-details" target="_blank" rel="noopener noreferrer">
                                            Pancake Logo
                                        </Link>
                                    </h3>
                                </div>
                            </div>
                        </div>
                        <div className="grid-item">
                            <div className="overlay">
                                <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/82/look-out.jpg" alt="Work"/>
                                <div className="inner">
                                    <h3>
                                        <Link to="/work-details" target="_blank" rel="noopener noreferrer">
                                            Pancake Logo
                                        </Link>
                                    </h3>
                                </div>
                            </div>
                        </div>
                        <div className="grid-item">
                            <div className="overlay">
                                <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/82/one-world-trade.jpg" alt="Work"/>
                                <div className="inner">
                                    <h3>
                                        <Link to="/work-details" target="_blank" rel="noopener noreferrer">
                                            Pancake Logo
                                        </Link>
                                    </h3>
                                </div>
                            </div>
                        </div>
                        <div className="grid-item">
                            <div className="overlay">
                                <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/82/drizzle.jpg" alt="Work"/>
                                <div className="inner">
                                    <h3>
                                        <Link to="/work-details" target="_blank" rel="noopener noreferrer">
                                            Pancake Logo
                                        </Link>
                                    </h3>
                                </div>
                            </div>
                        </div>
                        <div className="grid-item">
                            <div className="overlay">
                                <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/82/cat-nose.jpg" alt="Work"/>
                                <div className="inner">
                                    <h3>
                                        <Link to="/work-details" target="_blank" rel="noopener noreferrer">
                                            Pancake Logo
                                        </Link>
                                    </h3>
                                </div>
                            </div>
                        </div>
                        <div className="grid-item">
                            <div className="overlay">
                                <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/82/contrail.jpg" alt="Work"/>
                                <div className="inner">
                                    <h3>
                                        <Link to="/work-details" target="_blank" rel="noopener noreferrer">
                                            Pancake Logo
                                        </Link>
                                    </h3>
                                </div>
                            </div>
                        </div>
                        <div className="grid-item">
                            <div className="overlay">
                                <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/82/golden-hour.jpg" alt="Work"/>
                                <div className="inner">
                                    <h3>
                                        <Link to="/work-details" target="_blank" rel="noopener noreferrer">
                                            Pancake Logo
                                        </Link>
                                    </h3>
                                </div>
                            </div>
                        </div>
                        <div className="grid-item">
                            <div className="overlay">
                                <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/82/flight-formation.jpg" alt="Work"/>
                                <div className="inner">
                                    <h3>
                                        <Link to="/work-details" target="_blank" rel="noopener noreferrer">
                                            Pancake Logo
                                        </Link>
                                    </h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
 
            <Footer />
        </React.Fragment>
    )
}

export default Projects;