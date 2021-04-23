import React from "react"
import Layout from "../components/App/layout"
import SEO from "../components/App/seo"
import Navbar from "../components/DemoTwo/Navbar"
import MainBanner from "../components/DemoTwo/MainBanner"
import About from "../components/DemoTwo/About"
import Gallery from "../components/DemoTwo/Gallery"
import AwardsWon from "../components/DemoTwo/AwardsWon"
import BlogPost from "../components/DemoTwo/BlogPost"
import Ticket from "../components/DemoTwo/Ticket"
import Testimonials from "../components/DemoTwo/Testimonials"
import ContactForm from "../components/DemoTwo/ContactForm"
import Footer from "../components/DemoTwo/Footer"

const IndexPage = () => (
  <Layout>
    <Navbar />
    <SEO title="Home Demo Two" />
    <MainBanner />
    <About />
    <Gallery />
    <AwardsWon />
    <BlogPost />
    <Ticket />
    <Testimonials />
    <ContactForm />
    <Footer />
  </Layout>
)

export default IndexPage
