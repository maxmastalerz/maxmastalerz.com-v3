import React, {useEffect} from 'react'
import useScript from 'react-script-hook';
import { Link } from 'gatsby'
import project1 from '../../components/App/assets/images/projects/project1.jpg'
import project2 from '../../components/App/assets/images/projects/project2.jpg'
import project3 from '../../components/App/assets/images/projects/project3-accurate.jpg'
import project4 from '../../components/App/assets/images/projects/project4-accurate.jpg'

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
        <div id="projects" className="projects-area border-bottom-two ptb-100">
            <div className="container">
                <div className="section-title three">
                    <span className="sub-title">PROJECTS</span>
                    <h2>My Work In Action</h2>
                </div>

                {/*
                    Original picture sizes(WxH) (specifically ratios) we want:
                    518x357=1.45098039        344x386.47=0.89010
                    518x452=1.1460177         324x364=0.89010
                */}
                <div className="masonry-sm work-area">
                    <div className="grid">
                        <div className="grid-sizer"></div>
                        <div className="grid-item grid-item--width7-12ths">
                            <div className="overlay">
                                <img src={project1} alt="Work"/>
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
                                <img src={project3} alt="Work"/>
                                <div className="inner">
                                    <h3>
                                        <Link to="/work-details" target="_blank" rel="noopener noreferrer">
                                            Pancake Logo
                                        </Link>
                                    </h3>
                                </div>
                            </div>
                        </div>
                        <div className="grid-item grid-item--width7-12ths">
                            <div className="overlay">
                                <img src={project2} alt="Work"/>
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
                                <img src={project4} alt="Work"/>
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

                <div className="text-center">
                    <Link to="/projects" className="common-btn three">
                        Explore Projects
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Projects