import React, {useEffect} from 'react'
import useScript from 'react-script-hook';
import { Link, graphql, useStaticQuery } from 'gatsby';
import Image from 'gatsby-image';

const featuredProjectsQuery = graphql`
    {
        allStrapiProjects(limit: 4, sort: {fields: ordering, order: ASC}) {
            nodes {
                id
                name
                slug
                thumnail_img {
                    localFile {
                        childImageSharp {
                            fluid {
                                ...GatsbyImageSharpFluid
                            }
                        }
                    }
                }
            }
        }
    }
`;

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

    const {allStrapiProjects: { nodes }} = useStaticQuery(featuredProjectsQuery);

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

                        {nodes.map((project, i) => {
                            return (
                                <div className={"grid-item "+(i%2===0 ? "grid-item--width7-12ths" : "")} key={project.id}>
                                    <div className="overlay">
                                        <Image fluid={project.thumnail_img.localFile.childImageSharp.fluid} alt="Portfolio piece" />
                                        <div className="inner">
                                            <h3>
                                                <Link to={`/projects/${project.slug}`}>
                                                    {project.name}
                                                </Link>
                                            </h3>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
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