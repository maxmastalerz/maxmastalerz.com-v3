import React from 'react';
import TopHeader from '../components/Common/TopHeader';
import PageBanner from '../components/Common/PageBanner';
import Footer from '../components/Common/Footer'; 
import { Link, graphql } from 'gatsby';
import Image from 'gatsby-image';
import useScript from 'react-script-hook';

const ProjectDetails = ({ data, pageContext }) => {
    useScript({ src: '/oEmbed-init.js' });

    const previousProject = pageContext.previous;
    const { name, main_img, clients, date_start, date_end, categories, roles, description } = data.project;
    const nextProject = pageContext.next;

    const monthNames = ["January","February","March","April","May","June","July",
                        "August","September","October","November","December"];
    let monthStart, yearStart, monthEnd, yearEnd = null;
    if(date_start !== null) {
        const fullDateStart = new Date(`${date_start} EST`);
        monthStart = monthNames[fullDateStart.getMonth()];
        yearStart = fullDateStart.getFullYear();
    }
    if(date_end !== null) {
        const fullDateEnd = new Date(`${date_end} EST`);
        monthEnd = monthNames[fullDateEnd.getMonth()];
        yearEnd = fullDateEnd.getFullYear();
    }

    //Calculates the amount of bootstrap columns we need to display our data.
    let numCols = 0;
    const colGroups = [clients, [date_start, date_end], categories, roles];
    colGroups.forEach((colGroup) => {
        let isValid = true;

        if(colGroup !== null) {

            //If one of the columns is a group of values, check if all those values are non-null.
            //If one of the values in the group is null mark the whole column as invalid so we don't count it.
            if(Array.isArray(colGroup)) {
                colGroup.forEach((col) => {
                    if(col === null) {
                        isValid = false;
                        return;
                    }
                });
            }
            
            if(isValid) {
                numCols++; //column value or column group is valid. count it.
            }
        }
    });
    const columnSize = 12/numCols;

    return (
        <React.Fragment>
            <TopHeader seondLinkName="Projects" secondLinkUrl="/projects"/>
            <PageBanner 
                bgText={name} 
                pageTitle={name}
                homePageUrl="/" 
                homePageText="Home" 
                activePageText={name}
            /> 

            <div id="project" className="work-details-area pt-100">
                <div className="container">
                    <div className="details-img">
                        <Image fluid={main_img.localFile.childImageSharp.fluid} />

                        <div id="project-brief-info" className="row">
                            {clients && (
                                <div className={`col-sm-6 col-lg-${columnSize}`}>
                                    <div className="details-img-inner">
                                        <h3>Client</h3>
                                        <ul>
                                            {clients.split('\n').map((client) => {
                                                return (
                                                    <li>{client}</li>
                                                );
                                            })}
                                        </ul>
                                    </div>
                                </div>
                            )}

                            {(date_start && date_end) && (
                                <div className={`col-sm-6 col-lg-${columnSize}`}>
                                    <div className="details-img-inner">
                                        <h3>Date</h3>
                                        <ul>
                                            <li>{monthStart} {yearStart} -</li>
                                            <li>{monthEnd} {yearEnd}</li>
                                        </ul>
                                    </div>
                                </div>
                            )}

                            {categories && (
                                <div className={`col-sm-6 col-lg-${columnSize}`}>
                                    <div className="details-img-inner">
                                        <h3>Type / Classification</h3>
                                        <ul>
                                            {categories.split('\n').map((category) => {
                                                return (
                                                    <li key={category}>{category}</li>
                                                );
                                            })}
                                        </ul>
                                    </div>
                                </div>
                            )}

                            {roles && (
                                <div className={`col-sm-6 col-lg-${columnSize}`}>
                                    <div className="details-img-inner">
                                        <h3>Role</h3>
                                        <ul>
                                            {roles.split('\n').map((role) => {
                                                return (
                                                    <li key={role}>{role}</li>
                                                );
                                            })}
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    <div className="details-description">
                        <h3>Description</h3>
                        <div className="cms-content" dangerouslySetInnerHTML={{__html: description}} />
                    </div>

                    <div className="details-pages">
                        <div className="row align-items-center">
                            <div className="col-sm-4 col-lg-4">
                                {previousProject && (
                                    <div className="pages-item">
                                        <Link to={`/projects/${previousProject.slug}`} className="pre-project">
                                            <i className="flaticon-right-arrow"></i> Previous Project
                                        </Link>
                                    </div>
                                )}
                            </div>

                            <div className="col-sm-4 col-lg-4">
                                <div className="pages-item two">
                                    <Link to="/projects" className="common-btn">Go Back To Projects</Link>
                                </div>
                            </div>

                            <div className="col-sm-4 col-lg-4">
                                {nextProject && (
                                    <div className="pages-item three">
                                        <Link to={`/projects/${nextProject.slug}`} className="next-project">
                                            Next Project <i className="flaticon-right-arrow"></i>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
 
            <Footer />
        </React.Fragment>
    )
}

export const query = graphql`
  query GetSingleProject($slug: String) {
    project: strapiProjects(slug: { eq: $slug }) {
      name
      main_img {
        localFile {
            childImageSharp {
              fluid {
                ...GatsbyImageSharpFluid
              }
            }
        }
      }
      clients
      date_start
      date_end
      categories
      roles
      description
    }
  }
`;

export default ProjectDetails;