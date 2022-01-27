import React, { useEffect, useState, useRef } from "react"
import Seo from "../components/App/seo"
import Navbar from "../components/IndexPage/Navbar"
import MainBanner from "../components/IndexPage/MainBanner"
import About from "../components/IndexPage/About"
import Services from "../components/IndexPage/Services"
import Experience from "../components/IndexPage/Experience"
import Projects from "../components/IndexPage/Projects"
import FeaturedBlogPosts from "../components/IndexPage/FeaturedBlogPosts"
import Testimonials from "../components/IndexPage/Testimonials"
import ContactForm from "../components/IndexPage/ContactForm"
import Footer from "../components/Common/Footer"

import "../assets/styles/component-scope/IndexPage.scss";
import "../assets/styles/component-scope/IndexPage.responsive.scss";

const IndexPage = ({data}) => {
    const aboutRef = useRef();
    const experienceRef = useRef();

    const [displayMasonryProjects, setDisplayMasonryProjects] = useState(false);
    const [displayCarousel, setDisplayCarousel] = useState(false);

    useEffect(() => {
        window.addEventListener('scroll', handleWindowScroll);

        return () => {
            window.removeEventListener('scroll', handleWindowScroll);
        }
    }, []);

    const handleWindowScroll = () => {
        let distanceTilExperienceDiv = experienceRef.current.offsetTop - window.scrollY;
        let distanceTilAboutDiv = aboutRef.current.offsetTop - window.scrollY;

        if(distanceTilExperienceDiv <= 0) {
            setDisplayCarousel(true);
        }
        if(distanceTilAboutDiv <= 0) {
            setDisplayMasonryProjects(true);
        }
    }

    return (
        <div className="body-bg-three">
            <div className="main-area">
                <Navbar setDisplayMasonryProjects={setDisplayMasonryProjects}/>
                <Seo title="Home" />
                <div className="main-content">
                    <MainBanner />
                    <div ref={aboutRef}> {/*When we pass the about div, load in masonry*/}
                        <About />
                    </div>
                    <Services />
                    <div ref={experienceRef}> {/*When we pass the experience div, load in the carousel*/}
                        <Experience />
                    </div>
                    <Projects displayMasonryProjects={displayMasonryProjects}/>
                    <FeaturedBlogPosts />
                    <Testimonials displayCarousel={displayCarousel}/>
                    <ContactForm />
                    <Footer />
                </div>
            </div>
        </div>
    );

}

export default IndexPage