import React from 'react';
import { graphql } from 'gatsby';
import { GatsbyImage } from "gatsby-plugin-image";
import TopHeader from '../components/Common/TopHeader';
import PageBanner from '../components/Common/PageBanner';
import Footer from '../components/Common/Footer';
import useScript from 'react-script-hook';
import Seo from "../components/App/seo";

import "../assets/styles/component-scope/Service.scss";
import "../assets/styles/component-scope/Service.responsive.scss";

const Service = ({data}) => {
    useScript({ src: '/oEmbed-init.js' });
    const { title, long_desc, image, image_alt } = data.service;

    let image_alt_attr = (image_alt !== null) ? image_alt : "";

    return (
        <>
            <Seo title={title} description={`I am a Software Developer in Burlington. Do you need help with ${title}? Let's get in touch.`}/>
            <TopHeader />
            <PageBanner 
                bgText={title}
                pageTitle={title} 
                homePageUrl="/" 
                homePageText="Home" 
                activePageText={title}
            /> 

            <div id="service-details" className="service-details-area pt-100 pb-70">
                <div className="container">
                    <div className="details-item">
                        <GatsbyImage image={image.localFile.childImageSharp.gatsbyImageData} alt={image_alt_attr} />
                        <div className="cms-content" dangerouslySetInnerHTML={{__html: long_desc}} />
                    </div>
                </div>
            </div>
 
            <Footer />
        </>
    );
}

export const query = graphql`query GetService($slug: String) {
  service: strapiServices(slug: {eq: $slug}) {
    title
    long_desc
    image {
      localFile {
        childImageSharp {
          gatsbyImageData(layout: FULL_WIDTH)
        }
      }
    }
    image_alt
  }
}
`;

export default Service;