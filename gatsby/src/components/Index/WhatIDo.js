import React from 'react'
import { Link, graphql, useStaticQuery } from 'gatsby'

const query = graphql`
  {
    allStrapiSkill {
      nodes {
        header
        desc
        skills {
          icon
          desc
          name
          id
        }
      }
    }
  }
`

const WhatIDo = () => {
    const {allStrapiSkill: { nodes }} = useStaticQuery(query)
    return (
        <div className="what-area border-bottom pt-100 pb-70">
            <div className="common-right-text">
                <span>SERVICE</span>
            </div>

            {nodes.map((skillSet, idx) => {
                const { skills } = skillSet
                return (
                    <div className="container" key={idx}>
                        <div className="section-title">
                            <span className="sub-title">WHAT I DO</span>
                            <h2>{skillSet.header}</h2>
                            <p>{skillSet.desc}</p>
                        </div>

                        <div className="row">
                            {skills.map((skill) => {
                                return (
                                    <div className="col-sm-6 col-lg-6" key={skill.id}>
                                        <div className="what-item">
                                            <i className={skill.icon}></i>
                                            <h3>
                                                <Link to="/service-details">
                                                    {skill.name}
                                                </Link>
                                            </h3>
                                            <p>{skill.desc}</p>

                                            <Link to="/service-details" className="what-btn">
                                                Explore More <i className="flaticon-right-arrow"></i>
                                            </Link>
                                        </div>
                                    </div>
                                )
                            })}
                            
                        </div>
                    </div>
                )
            })}

        </div>
    )
}

export default WhatIDo