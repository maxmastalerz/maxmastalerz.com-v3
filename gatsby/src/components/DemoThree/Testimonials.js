import React from 'react'

import { graphql, useStaticQuery } from 'gatsby';
import Image from 'gatsby-image';

import review1 from '../../components/App/assets/images/review/review1.jpg'
import review2 from '../../components/App/assets/images/review/review2.jpg'
import review3 from '../../components/App/assets/images/review/review3.jpg'

import Loadable from "@loadable/component"
const OwlCarousel = Loadable(() => import("react-owl-carousel3"))

const options = {
    items: 1,
    loop: true,
    margin: 0,
    nav: true,
    dots: false,
    smartSpeed: 1000,
    autoplay: true,
    autoplayTimeout: 3000,
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
          childImageSharp {
            fixed(width: 100) {
              ...GatsbyImageSharpFixed
            }
          }
        }
      }
    }
  }
`;

const Testimonials = () => {
    const {allStrapiTestimonials: { nodes }} = useStaticQuery(query);

    const [display, setDisplay] = React.useState(false);

    React.useEffect(() => {
        setDisplay(true);
    }, [])

    return (
        <div className="review-area two three five border-bottom-two ptb-100">
            <div className="container">
                <div className="section-title three">
                    <span className="sub-title">TESTIMONIALS</span>
                    <h2>Here's What Some People Had to Say</h2>
                    <p>These are a few of the testimonials I received from people I worked with.</p>
                </div>

                {display ? <OwlCarousel 
                    className="review-slider owl-carousel owl-theme"
                    {...options}
                > 
                    {nodes.map((testimonial) => {
                        return (
                            <div className="review-item" key={testimonial.id}>
                                <i className='bx bxs-quote-right'></i>
                                <p>{testimonial.desc}</p>
                                <Image alt="Review" fixed={testimonial.images.childImageSharp.fixed} />
                                <h3>{testimonial.name}</h3>
                                <span>{testimonial.position}</span>
                            </div>
                        )
                    })}
                </OwlCarousel> : ''}
            </div>
        </div>
    )
}

export default Testimonials