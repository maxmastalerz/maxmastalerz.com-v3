import React, { useState, useEffect } from 'react';
import useScript from 'react-script-hook';
import { Link, graphql, useStaticQuery } from 'gatsby';
import { GatsbyImage } from "gatsby-plugin-image";

const featuredProjectsQuery = graphql`{
  allStrapiProjects(limit: 4, sort: {fields: ordering, order: ASC}) {
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

const ProjectsMasonry = (props) => {
	props.displayMasonryProjects = false;
    const [loadedMasonry, setLoadedMasonry] = useState(false);
    const [loadedImagesloaded, setLoadedImagesloaded] = useState(false);

    const [, ] = useScript({
        src: props.displayMasonryProjects ? '/masonry.pkgd.min.js' : null,
        onload: () => {
            setLoadedMasonry(true);
        }
    });
        
    const [, ] = useScript({
        src: props.displayMasonryProjects ? '/imagesloaded.pkgd.min.js' : null,
        onload: () => {
            setLoadedImagesloaded(true);
        }
    });

    useEffect(() => {
        if(!(loadedMasonry && loadedImagesloaded)) { //If still loading js libraries, skip
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

    }, [loadedMasonry, loadedImagesloaded]);
    
    const {allStrapiProjects: { nodes }} = useStaticQuery(featuredProjectsQuery);

	return (
		<>
		{/*
            Original picture sizes(WxH) (specifically ratios) we want:
            518x357=1.45098039        344x386.47=0.89010
            518x452=1.1460177         324x364=0.89010
        */}
        { props.displayMasonryProjects ?
		<div className="masonry-sm work-area">
            <div className="grid">
                <div className="grid-sizer"></div>

                {nodes.map((project, i) => {
                    return (
                        <Link to={`/projects/${project.slug}`} key={project.id}>
                            <div className={"grid-item "+(i%2===0 ? "grid-item--width7-12ths" : "")} >
                                <div className="overlay">
                                    <GatsbyImage
                                        image={project.thumnail_img.localFile.childImageSharp.gatsbyImageData}
                                        alt="Portfolio piece" />
                                    <div className="inner">
                                        <h3>
                                            <p>
                                                {project.name}
                                            </p>
                                        </h3>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
        :
        <div id="index-page-projects-placeholder">LOADING</div>
    	}
    	</>

	);
}

export default ProjectsMasonry;