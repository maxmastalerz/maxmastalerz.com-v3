import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/App/layout"
import SEO from "../components/App/seo"
import Navbar from "../components/DemoThree/Navbar"
import MainBanner from "../components/DemoThree/MainBanner"
import About from "../components/DemoThree/About"
import Services from "../components/DemoThree/Services"
import Experience from "../components/DemoThree/Experience"
import Skills from "../components/DemoThree/Skills"
import Projects from "../components/DemoThree/Projects"
import BlogPost from "../components/DemoThree/BlogPost"
import Testimonials from "../components/DemoThree/Testimonials"
import ContactForm from "../components/DemoThree/ContactForm"
import Footer from "../components/DemoThree/Footer"

const IndexPage = ({data}) => {
    const {allStrapiBanner: {nodes} } = data

    return (
        <Layout>
            <div className="body-bg-five">
                <div className="main-area two">
                    <Navbar />
                    <SEO title="Home" />
                    <div className="main-content two">
                        <MainBanner />
                        <About />
                        <Services />
                        <Experience />
                        {/*<Skills />*/}
                        <Projects />
                        <BlogPost />
                        <Testimonials />
                        <ContactForm />
                        <Footer />
                    </div>
                </div>
            </div>
        </Layout>
    );

}

export default IndexPage

export const query = graphql`
  {
    allStrapiBanner {
      nodes {
        name
        desc
        fb_url
        tw_url
        in_url
        be_url
        dr_url
        hire_link
        contact_link
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