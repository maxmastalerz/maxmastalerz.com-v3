import React from "react"
import { graphql } from "gatsby"
import Image from 'gatsby-image'
import Layout from "../components/App/layout"
import SEO from "../components/App/seo"
import Navbar from "../components/Index/Navbar"
import MainBanner from "../components/Index/MainBanner"
import About from "../components/Index/About"
import WhatIDo from "../components/Index/WhatIDo"
import MyExperience from "../components/Index/MyExperience"
import Portfolio from "../components/Index/Portfolio"
import AwardsWon from "../components/Index/AwardsWon"
import BlogPost from "../components/Index/BlogPost"
import Testimonials from "../components/Index/Testimonials"
import ContactForm from "../components/Index/ContactForm"
import Footer from "../components/Index/Footer"

export default ({ data }) => {
  const {allStrapiBanner: {nodes} } = data
  // console.log(data)

  return (
    <Layout>
      <Navbar />
      <SEO title="Home" />
      <div className="main-area">
        <div 
          className="main-left-img"
          style={{backgroundImage: `url(${nodes[0].image.childImageSharp.fluid.src})`}}
        >
          {/* <img src={bannerImg} alt="banner" /> */}
          <Image fluid={nodes[0].image.childImageSharp.fluid} />
        </div>

        <div className="main-content">
          {nodes.map((cnt, idx) => {
            return <MainBanner key={idx} {...cnt} />
          })}
          <About />
          <WhatIDo />
          <MyExperience />
          <Portfolio />
          <AwardsWon />
          <BlogPost />
          <Testimonials />
          <ContactForm />
          <Footer />
        </div>
      </div>
    </Layout>
  )
}

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