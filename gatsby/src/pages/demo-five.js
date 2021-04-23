import React from "react"
import Layout from "../components/App/layout"
import SEO from "../components/App/seo"
import Navbar from "../components/DemoFive/Navbar"
import MainBanner from "../components/DemoFive/MainBanner"
import CaseStudy from "../components/DemoFive/CaseStudy"
import Services from "../components/DemoFive/Services"
import AboutMe from "../components/DemoFive/AboutMe"
import FunFacts from "../components/DemoFive/FunFacts"
import Pricing from "../components/DemoFive/Pricing"
import BlogPost from "../components/DemoFive/BlogPost"
import Testimonials from "../components/DemoFive/Testimonials"
import ContactForm from "../components/DemoFive/ContactForm"
import Footer from "../components/DemoFive/Footer"

const IndexPage = () => (
    <Layout>
        <SEO title="Home Demo Three" />
        <div className="body-bg-five">
            <Navbar />
            <MainBanner />
            <CaseStudy />
            <Services />
            <AboutMe />
            <FunFacts />
            <Pricing />
            <BlogPost />
            <Testimonials />
            <ContactForm />
            <Footer />
        </div>
    </Layout>
)

export default IndexPage