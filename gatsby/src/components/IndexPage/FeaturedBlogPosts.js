import React from 'react'
import { Link, graphql, useStaticQuery } from 'gatsby'
import { GatsbyImage } from "gatsby-plugin-image";

export const query = graphql`{
  allStrapiBlogs(limit: 2, sort: {fields: created_at, order: DESC}) {
    nodes {
      title
      short_desc
      slug
      id
      date
      image {
        localFile {
          childImageSharp {
            gatsbyImageData(layout: FULL_WIDTH)
          }
        }
      }
    }
  }
}
`

const FeaturedBlogPosts = () => {
    const {allStrapiBlogs: { nodes }} = useStaticQuery(query);
    const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

    return (
        <div id="blog-preview" className="blog-area three border-bottom-two ptb-100">
            <div className="container">
                <div className="section-title three">
                    <span className="sub-title">BLOG</span>
                    <h2>I Have a Blog You May Like</h2>
                    <p>If you enjoy reading about tech I hope you enjoy the blog. It's very new so bear with me while I work on adding content.</p>
                </div>

                <div className="row">
                    {nodes.map((blog) => {
                        let fullDate = new Date(blog.date);
                        let date = fullDate.getDate();
                        let month = monthNames[fullDate.getMonth()];

                        return (
                            <div className="col-sm-6 col-lg-6" key={blog.id}>
                                <div className="blog-item">
                                    <div className="top">
                                        <Link to={`/blog/${blog.slug}`}>
                                            <GatsbyImage image={blog.image.localFile.childImageSharp.gatsbyImageData} alt="Blog" />
                                        </Link>
                                        <h4>{("0"+date).slice(-2)} <span>{month}</span></h4>
                                    </div>

                                    <div className="bottom">
                                        <h3>
                                            <Link to={`/blog/${blog.slug}`}>
                                                {blog.title}
                                            </Link>
                                        </h3>
                                        <p>{blog.short_desc}</p>

                                        <Link to={`/blog/${blog.slug}`} className="blog-btn">
                                            Read More <i className="bx bxs-right-arrow"></i>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="text-center">
                    <Link to="/blog" className="common-btn three">
                        Check It Out
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default FeaturedBlogPosts