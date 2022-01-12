import React from 'react';
import { graphql } from 'gatsby';
import Image from 'gatsby-image';
import TopHeader from '../components/Common/TopHeader';
import PageBanner from '../components/Common/PageBanner';
import Footer from '../components/Common/Footer';
import useScript from 'react-script-hook';

import "../assets/styles/component-scope/css/Service.css";
import "../assets/styles/component-scope/css/Service.responsive.css";

const Service = ({data}) => {
    useScript({ src: '/oEmbed-init.js' });
    const { title, long_desc, image } = data.service;

    return (
        <React.Fragment>
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
                        <Image fluid={image.localFile.childImageSharp.fluid} />
                        <div className="cms-content" dangerouslySetInnerHTML={{__html: long_desc}} />
                    </div>
                </div>
            </div>
 
            <Footer />
        </React.Fragment>
    )
}

export const query = graphql`
  query GetService($slug: String) {
    service: strapiServices(slug: { eq: $slug }) {
        title
        long_desc
        image {
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
`;

export default Service;