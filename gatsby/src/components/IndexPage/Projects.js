import React from 'react';
import { Link } from 'gatsby';

import ProjectsMasonry from "./ProjectsMasonry";

const Projects = (props) => {
    return (
        <div id="projects" className="border-bottom-two ptb-100">
            <div className="container">
                <div className="section-title">
                    <span className="sub-title">PROJECTS</span>
                    <h2>My Work In Action</h2>
                </div>
                
                <ProjectsMasonry displayMasonryProjects={props.displayMasonryProjects} />

                <div className="text-center">
                    <Link to="/projects" className="common-btn three">
                        Explore Projects
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Projects