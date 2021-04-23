import React from "react"
import Layout from "../components/App/layout"
import SEO from "../components/App/seo"
import Navbar from "../components/DemoSix/Navbar"
import MainBanner from "../components/DemoSix/MainBanner"
import AboutMe from "../components/DemoSix/AboutMe"
import Services from "../components/DemoSix/Services"
import FunFacts from "../components/DemoSix/FunFacts"
import Gallery from "../components/DemoSix/Gallery"
import Pricing from "../components/DemoSix/Pricing"
import Testimonials from "../components/DemoSix/Testimonials"
import Partners from "../components/DemoSix/Partners"
import BlogPost from "../components/DemoSix/BlogPost"
import ContactForm from "../components/DemoSix/ContactForm"
import Footer from "../components/DemoSix/Footer"

const IndexPage = () => (
    <Layout>
        <SEO title="Home Demo Three" />
        <div className="body-bg-five">
            <Navbar />
            <MainBanner />
            <AboutMe />
            <Services />
            <FunFacts />
            <Gallery />
            <Pricing />
            <Testimonials />
            <Partners />
            <BlogPost />
            <ContactForm />
            <Footer />
        </div>
    </Layout>
)

export default IndexPage