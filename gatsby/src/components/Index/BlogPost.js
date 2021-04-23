import React from 'react'
import { Link, graphql, useStaticQuery } from 'gatsby'
import Image from 'gatsby-image'

export const query = graphql`
  {
    allStrapiBlogs {
      nodes {
        title
        short_desc
        slug
        id
        date
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

const BlogPost = () => {
    const {allStrapiBlogs: { nodes }} = useStaticQuery(query)
    return (
        <div id="blog" className="blog-area border-bottom ptb-100">
            <div className="common-right-text">
                <span>BLOG</span>
            </div>

            <div className="container">
                <div className="section-title">
                    <span className="sub-title">BLOG</span>
                    <h2>Read My <span>Blog</span> To Know More About My Design Process</h2>
                    <p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, seddiam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.</p>
                </div>

                <div className="row">
                    {nodes.map((blog) => {
                        return (
                            <div className="col-sm-6 col-lg-6" key={blog.id}>
                                <div className="blog-item">
                                    <div className="top">
                                        <Link to={`/blogs/${blog.slug}`}>
                                            <Image fluid={blog.image.childImageSharp.fluid} />
                                        </Link>
                                        <h4>{blog.date}</h4>
                                    </div>
                                    <div className="bottom">
                                        <h3>
                                            <Link to={`/blogs/${blog.slug}`}>
                                                {blog.title}
                                            </Link>
                                        </h3>
                                        <p>{blog.short_desc}</p>

                                        <Link to={`/blogs/${blog.slug}`} className="blog-btn">
                                            Read More <i className="flaticon-right-arrow"></i>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        )
                    })}

                </div>

                <div className="text-center">
                    <Link to="/blog" className="common-btn">
                        Explore Blog
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default BlogPost