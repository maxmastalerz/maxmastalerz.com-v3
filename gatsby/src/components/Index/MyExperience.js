import React from 'react'
import { Link, graphql, useStaticQuery } from 'gatsby'

const query = graphql`
  {
    allStrapiExperience {
      nodes {
        header
        desc
        experiences {
          year_range
          position
          desc
          id
        }
        id
      }
    }
  }
`

const MyExperience = () => {
    const {allStrapiExperience: { nodes }} = useStaticQuery(query)
    return (
        <div className="experience-area border-bottom ptb-100">
            <div className="common-right-text">
                <span>EXPERIENCE</span>
            </div>
            {nodes.map((experienceSet) => {
                const {experiences} = experienceSet
                return (
                    <div className="container" key={experienceSet.id}>
                        <div className="section-title">
                            <span className="sub-title">MY EXPERIENCE</span>
                            <h2 dangerouslySetInnerHTML={{__html: `${experienceSet.header}`}} />
                            <p>{experienceSet.desc}</p>
                        </div>

                        <div className="experience-content">

                            {experiences.map((exp) => {
                                return(
                                    <div className="experience-inner" key={exp.id}>
                                        <ul className="align-items-center">
                                            <li>
                                                <span>{exp.year_range}</span>
                                            </li>
                                            <li>
                                                <span>{exp.position}</span>
                                            </li>
                                            <li>
                                                <p>{exp.desc}</p>
                                            </li>
                                        </ul>
                                    </div>
                                )
                            })}

                            <p>I have also done many freelance work alongside with the company's work which helps me to upgrade my skills and passion.</p>

                            <div className="text-center">
                                <Link to="#" className="common-btn">
                                    See My Portfolio
                                </Link>
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default MyExperience