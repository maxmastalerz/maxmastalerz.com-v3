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
    const {allStrapiBlogs: { nodes }} = useStaticQuery(query);

    return (
        <div id="blog" className="blog-area three border-bottom-two pt-100 pb-70">
            <div className="container">
                <div className="section-title three">
                    <span className="sub-title">BLOG</span>
                    <h2>I Have a Blog You May Like</h2>
                    <p>If you enjoy reading about tech I hope you enjoy the blog. It's very new so bear with me while I work on adding content.</p>
                </div>

                <div className="row">
                    {nodes.map((blog) => {
                        return (
                            <div className="col-sm-6 col-lg-6" key={blog.id}>
                                <div className="blog-item">
                                    <div className="top">
                                        <Link to={`/blogs/${blog.slug}`}>
                                            <Image fluid={blog.image.childImageSharp.fluid} alt="Blog" />
                                        </Link>
                                        <h4>{blog.date.split(' ')[0]} <span>{blog.date.split(' ')[1]}</span></h4>
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
            </div>
        </div>
    )
}

export default BlogPost