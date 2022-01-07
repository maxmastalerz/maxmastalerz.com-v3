import React, { useEffect, useState, useRef } from "react"
import Seo from "../components/App/seo"
import Navbar from "../components/DemoThree/Navbar"
import MainBanner from "../components/DemoThree/MainBanner"
import About from "../components/DemoThree/About"
import Services from "../components/DemoThree/Services"
import Experience from "../components/DemoThree/Experience"
import Projects from "../components/DemoThree/Projects"
import BlogPost from "../components/DemoThree/BlogPost"
import Testimonials from "../components/DemoThree/Testimonials"
import ContactForm from "../components/DemoThree/ContactForm"
import Footer from "../components/Common/Footer"

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
        <div className="body-bg-five">
            <div className="main-area two">
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
                    <BlogPost />
                    <Testimonials displayCarousel={displayCarousel}/>
                    <ContactForm />
                    <Footer />
                </div>
            </div>
        </div>
    );

}

export default IndexPage