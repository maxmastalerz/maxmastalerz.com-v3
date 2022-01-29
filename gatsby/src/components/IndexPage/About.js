import React from 'react'
import profilePicture from '../../assets/images/profile-picture.webp';

import { graphql, useStaticQuery } from 'gatsby'
import { getLiameym } from '../../utils/emailObfuscationHelpers';

const query = graphql`
  {
    allStrapiAboutMe {
      nodes {
        header
        desc
        age
        address
        phone
        residence
        website
        email
      }
    }
  }
`;

const About = () => {
    const {allStrapiAboutMe: { nodes }} = useStaticQuery(query)

    return (
        <div id="about" className="about-area border-bottom-two ptb-100">
            <div className="container align-items-center">
                <div className="row align-items-center">
                    <div className="col-lg-5">
                        <div className="about-img-three">
                            <img height="548" width="312" src={profilePicture} alt="Max Mastalerz at the Bonneville Salt Flats in Utah." />
                        </div>
                    </div>

                    <div className="col-lg-7">
                        <div className="about-content">
                            <div className="section-title">
                                <span className="sub-title">ABOUT ME</span>
                                <h2>{nodes[0].header}</h2>
                                <p>{nodes[0].desc}</p>
                            </div>

                            <div className="row">
                                <div className="col-lg-6">
                                    <div className="left">
                                        <ul>
                                            <li>
                                                <span>LinkedIn:</span>
                                                <a href="https://www.linkedin.com/in/max-mastalerz/" target="_blank" rel="noopener noreferrer">LinkedIn.com/in/Max-Mastalerz</a>
                                            </li>
                                            <li>
                                                <span>GitHub:</span>
                                                <a href="https://github.com/maxmastalerz" target="_blank" rel="noopener noreferrer">GitHub.com/MaxMastalerz</a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="col-lg-6">
                                    <div className="right">
                                        <ul>
                                            <li>
                                                <span>Phone:</span>
                                                <a href={"tel:"+nodes[0].phone}>{nodes[0].phone}</a>
                                            </li>
                                            <li id="liameym1">
                                                <span>:liamE</span>
                                                <span onClick={getLiameym} onKeyDown={getLiameym} role="button" aria-label="Copy email address" tabindex="0" dangerouslySetInnerHTML={{
                                                    __html: '&#099;<!---->&#111;&#110;<!--lol-->&#116;&#097;&#099;&#116;&#064;&#109;&#097;&#120;<!--@-->&#109;&#097;&#115;&#116;&#097;&#108;&#101;&#114;<!--.com-->&#122;&#046;&#099;<!--<!---->&#111;&#109;'
                                                }}/>
                                            </li>
                                            {/*<li>
                                                <span>Website:</span>
                                                <a href={nodes[0].website} target="_blank">{nodes[0].website}</a>
                                            </li>*/}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default About