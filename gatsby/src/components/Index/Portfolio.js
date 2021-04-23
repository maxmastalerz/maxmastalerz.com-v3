import React from 'react'
import { Link, graphql, useStaticQuery } from 'gatsby'
import Image from 'gatsby-image'

export const query = graphql`
  {
    allStrapiPortfolios {
      nodes {
        name
        category
        desc
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
`

const Portfolio = () => {
    const {allStrapiPortfolios: { nodes }} = useStaticQuery(query)
    return (
        <div id="portfolio" className="portfolio-area border-bottom ptb-100">
            <div className="container">
                <div className="section-title">
                    <span className="sub-title">PORTFOLIO</span>
                    <h2>See My Works Which Will Amaze You</h2>
                </div>
                
                <div className="row">
                    {nodes.map((portfolio, idx) => {
                        return (
                        <div className="col-sm-6 col-lg-6" key={idx}>
                            <div className="portfolio-item">
                                <div className="top">
                                    <Image fluid={portfolio.image.childImageSharp.fluid} /> 
                                </div>
                                <div className="bottom">
                                    <div className="bottom-one">
                                        <h3>
                                            <Link to="/case-study-details">
                                                {portfolio.name}
                                            </Link>
                                        </h3>
                                        <span>{portfolio.category}</span>
                                    </div>
                                    <div className="bottom-two">
                                        <p>{portfolio.desc}</p>

                                        <Link to="/case-study-details">
                                            Explore More <i className="flaticon-right-arrow"></i>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        )
                    })}

                </div>

                <div className="text-center">
                    <Link to="#" className="common-btn">
                        Explore All Work
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Portfolio