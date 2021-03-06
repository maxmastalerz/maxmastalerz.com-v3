import React, { useEffect } from 'react';
import useScript from 'react-script-hook';
import TopHeader from '../components/Common/TopHeader';
import PageBanner from '../components/Common/PageBanner';
import Footer from '../components/Common/Footer'; 
import { Link, graphql, useStaticQuery } from 'gatsby';
import { GatsbyImage } from "gatsby-plugin-image";
import Seo from "../components/App/seo";

const projectsQuery = graphql`{
  allStrapiProjects(sort: {fields: ordering, order: ASC}) {
    nodes {
      id
      name
      slug
      thumnail_img {
        localFile {
          childImageSharp {
            gatsbyImageData(layout: FULL_WIDTH)
          }
        }
      }
    }
  }
}
`;

const Projects = () => {
    const [loadingMasonry, ] = useScript({ src: '/masonry.pkgd.min.js' });
    const [loadingImagesLoaded, ] = useScript({ src: '/imagesloaded.pkgd.min.js'});

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

    const {allStrapiProjects: { nodes }} = useStaticQuery(projectsQuery);

    return (
        <>
            <Seo title="Max's Projects" description="This page contains all my interesting projects for you to check out. Enjoy!"/>
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
                        {nodes.map((project) => {
                            return (
                                <Link key={project.id} to={`/projects/${project.slug}`}>
                                    <div className="grid-item">
                                        <div className="overlay">
                                            <GatsbyImage
                                                image={project.thumnail_img.localFile.childImageSharp.gatsbyImageData}
                                                alt="Portfolio piece" />
                                            <div className="inner">
                                                <h3>
                                                    <p>{project.name}</p>
                                                </h3>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
 
            <Footer />
        </>
    );
}

export default Projects;