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
    
    const experienceRef = useRef();

    const [displayCarousel, setDisplayCarousel] = useState(false);

    useEffect(() => {
        window.addEventListener('scroll', handleWindowScroll);

        return () => {
            window.removeEventListener('scroll', handleWindowScroll);
        }
    }, []);

    const handleWindowScroll = () => {
        let distanceTilDiv = experienceRef.current.offsetTop - window.scrollY;
        if(distanceTilDiv <= 0) {
            setDisplayCarousel(true);
        }
    }

    return (
        
        <div className="body-bg-three">
            <div className="main-area">
                <Navbar />
                <Seo title="Home" />
                <div className="main-content two">
                    <MainBanner />
                    <About />
                    <Services />
                    <div ref={experienceRef}> {/*When we pass the experience div, load in the carousel*/}
                        <Experience />
                    </div>
                    <Projects />
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