import React from 'react'
import aboutImg from '../../components/App/assets/images/about4.webp'
import { graphql, useStaticQuery } from 'gatsby'

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
        <div id="about" className="about-area border-bottom-two three ptb-100">
            <div className="container align-items-center">
                <div className="row align-items-center">
                    <div className="col-lg-5">
                        <div className="about-img-three">
                            <img height="548" width="312" src={aboutImg} alt="About" />
                        </div>
                    </div>

                    <div className="col-lg-7">
                        <div className="about-content">
                            <div className="section-title three">
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
                                            <li>
                                                <span>Email:</span>
                                                <a href={"mailto:"+nodes[0].email}>{nodes[0].email}</a>
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