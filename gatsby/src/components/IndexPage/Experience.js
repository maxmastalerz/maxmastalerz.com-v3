import React from 'react';
import { graphql, useStaticQuery } from 'gatsby';

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
        certifications {
          id
          name
        }
        id
      }
    }
  }
`;

const Experience = () => {
    const {allStrapiExperience: { nodes }} = useStaticQuery(query);

    return (
        <div id="experience" className="experience-area border-bottom-two ptb-100">
            {nodes.map((experienceSet) => {
                const {experiences, certifications} = experienceSet
                return (
                    <div className="container" key={experienceSet.id}>
                        <div className="section-title">
                            <span className="sub-title">EXPERIENCE</span>
                            <h2>{experienceSet.header}</h2>
                            <p>{experienceSet.desc}</p>
                        </div>

                        <div className="experience-content">

                            {experiences.map((exp) => {
                                return(
                                    <div className="experience-inner" key={exp.id}>
                                        <ul className="align-items-center">
                                            <li>
                                                <span dangerouslySetInnerHTML={{__html: `${exp.year_range}`}} />
                                            </li>
                                            <li>
                                                <span dangerouslySetInnerHTML={{__html: `${exp.position}`}} />
                                            </li>
                                            <li>
                                                <p>{exp.desc}</p>
                                            </li>
                                        </ul>
                                    </div>
                                )
                            })}
                        
                            <div className="mb-4">
                                <h3>Certifications</h3>
                            </div>

                            <ul>
                            {certifications.map((certification) => (
                                <li key={certification.id}>{certification.name}</li>
                            ))}
                            </ul>
                        </div>
                        
                    </div>
                )
            })}
        </div>
    )
}

export default Experience