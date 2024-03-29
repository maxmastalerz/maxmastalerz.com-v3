import React from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import Loadable from "@loadable/component";
import { GatsbyImage } from "gatsby-plugin-image";

const OwlCarousel = Loadable(() => import("react-owl-carousel3"), {
  fallback: <div id="carousel-placeholder"></div>
});

const options = {
    items: 1,
    loop: true,
    margin: 0,
    nav: true,
    dots: false,
    smartSpeed: 250,
    autoplay: true,
    autoplayTimeout: 12000,
    autoplayHoverPause: true,
    animateOut: 'fadeOut',
    animateIn: 'fadeIn',
    navText: [
        "<i class='bx bx-chevron-left'></i>",
        "<i class='bx bx-chevron-right'></i>"
    ],
}

export const query = graphql`
  {
    allStrapiTestimonials {
      nodes {
        id
        name
        position
        desc
        images {
          url
          localFile {
            childImageSharp {
              gatsbyImageData(layout: FULL_WIDTH)
            }
          }
        }
      }
    }
  }
`;

const Testimonials = (props) => {
    const {allStrapiTestimonials: { nodes }} = useStaticQuery(query);

    return (
        <div id="testimonials" className="review-area border-bottom-two ptb-100">
            <div className="container">
                <div className="section-title">
                    <span className="sub-title">TESTIMONIALS</span>
                    <h2>Here's What Some People Had to Say</h2>
                    <p>These are a few of the testimonials I received from people I have worked with.</p>
                </div>

                { props.displayCarousel ?
                    <OwlCarousel 
                        className="review-slider owl-carousel owl-theme"
                        {...options}
                    > 
                        {nodes.map((testimonial) => {
                            return (
                                <div className="review-item" key={testimonial.id}>
                                    <i className='bx bxs-quote-right'></i>
                                    <p>{testimonial.desc}</p>
                                    <div className="testimonial-image">
                                        <GatsbyImage image={testimonial.images.localFile.childImageSharp.gatsbyImageData} alt="Review" style={{borderRadius: "50%"}} />
                                    </div>
                                    <h3>{testimonial.name}</h3>
                                    <span>{testimonial.position}</span>
                                </div>
                            )
                        })}
                    </OwlCarousel>
                :
                    <div id="carousel-placeholder"></div>
                }
            </div>
        </div>
    )
}

export default Testimonials