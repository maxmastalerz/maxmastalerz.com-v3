import React from 'react'
import { Link, graphql, useStaticQuery } from 'gatsby'

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
`

const About = () => {
    const {allStrapiAboutMe: { nodes }} = useStaticQuery(query)
    // console.log(nodes)
    return (
        <div id="about" className="about-area border-bottom ptb-100">
            <div className="common-right-text">
                <span>ABOUT</span>
            </div>

            <div className="container">
                <div className="about-content">
                    <div className="section-title">
                        <span className="sub-title">ABOUT ME</span>
                        <h2>{nodes[0].header}</h2>
                        <p>{nodes[0].desc}</p>
                    </div>

                    <div className="row">
                        <div className="col-sm-6 col-lg-6">
                            <div className="left">
                                <ul>
                                    <li>
                                        <span>Age:</span> {nodes[0].age}
                                    </li>
                                    <li>
                                        <span>Residence:</span> {nodes[0].residence}
                                    </li>
                                    <li>
                                        <span>Address:</span>
                                        <Link to="#">
                                            {nodes[0].address}
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="col-sm-6 col-lg-6">
                            <div className="right">
                                <ul>
                                    <li>
                                        <span>Phone:</span>
                                        <a href="tel:+00932123456">{nodes[0].phone}</a>
                                    </li>
                                    <li>
                                        <span>Email:</span>
                                        <a href={nodes[0].email}>{nodes[0].email}</a>
                                    </li>
                                    <li>
                                        <span>Website:</span>
                                        <a href={nodes[0].website}>
                                            {nodes[0].website}
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default About