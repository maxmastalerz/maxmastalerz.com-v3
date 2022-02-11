import React from 'react';
import AnchorLink from 'react-anchor-link-smooth-scroll';

const MainBanner = () => {
    //const {allStrapiBanner: {nodes} } = data
    
    return (
        <div id="home" className="banner-area border-bottom-two">
            <div className="common-right-text-two">
                <span>Max <br /> Mastalerz <br /> Software <br /> Engineer <br /> Full Stack <br /> Developer</span>
            </div>
            
            <div className="d-table">
                <div className="d-table-cell">
                    <div className="container">
                        <div className="banner-content">
                            <h1><span>Max</span> Mastalerz</h1>
                            <p>Hello and welcome to my site! I am a <span>Software Engineer/Developer</span> with a degree from the University of Guelph. I've completed 6 internship terms(at 4 companies) and am currently working as a full time developer at Tulip Retail. If you need a hand creating highly scaleable and robust software you've come to the right place.</p>

                            <div className="banner-btn-area">
                                <AnchorLink className="common-btn three" href="#contact">
                                    Contact Me
                                </AnchorLink>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MainBanner

/*export const query = graphql`
  {
    allStrapiBanner {
      nodes {
        name
        desc
        fb_url
        tw_url
        in_url
        be_url
        dr_url
        hire_link
        contact_link
        image {
          childImageSharp {
            fluid {
              ...GatsbyImageSharpFluid
            }
          }
        }
      }
    }
  }
`*/