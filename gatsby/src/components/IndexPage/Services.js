import React from 'react'
import { Link, graphql, useStaticQuery } from 'gatsby';
import AnchorLink from 'react-anchor-link-smooth-scroll';

export const query = graphql`
  {
    allStrapiServices(sort: {fields: ordering, order: ASC}) {
      nodes {
        id
        icon
        title
        slug
        short_desc
        has_dedicated_page
      }
    }
  }
`;

const Services = () => {
    const {allStrapiServices: { nodes }} = useStaticQuery(query);

    return (
        <div id="services" className="what-area three border-bottom-two pt-100 pb-70">
            <div className="container">
                <div className="section-title three">
                    <span className="sub-title">SERVICES</span>
                    <h2>What Does Your Project, Team, or Company Need?</h2>
                    <p>I have experience in many different areas. Let's narrow down your search.</p>
                </div>

                <div className="row">
                    {nodes.map((service) => {
                        return (
                            <div className="col-sm-6 col-lg-6 mb-4" key={service.id}>
                                <div className="what-item">
                                    <i className={`bx ${service.icon} icon`}></i>
                                    <h3>
                                        {service.has_dedicated_page
                                        ? <Link to={`/services/${service.slug}`}>{service.title}</Link>
                                        :
                                        <AnchorLink offset={() => -1} href="#contact">
                                            <span>{service.title}</span>
                                        </AnchorLink>
                                        }
                                    </h3>
                                    {service.has_dedicated_page
                                    ?
                                        <Link to={`/services/${service.slug}`}><p>{service.short_desc}</p></Link>
                                    :
                                        <AnchorLink offset={() => -1} href="#contact">
                                            <p>{service.short_desc}</p>
                                        </AnchorLink>
                                    }

                                    {service.has_dedicated_page &&
                                    <Link to={`/services/${service.slug}`} className="what-btn">
                                        Service Details <i className="bx bxs-right-arrow"></i>
                                    </Link>
                                    }
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    )
}

export default Services