import React from 'react' 
import TopHeader from '../components/Blog/TopHeader'
import PageBanner from '../components/Common/PageBanner'
import Footer from "../components/DemoThree/Footer";
import { Link, useStaticQuery } from 'gatsby';
import Image from 'gatsby-image';

export const query = graphql`
  {
    allStrapiBlogs(sort: {fields: created_at, order: DESC}) {
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

const Blog = () => {
    const {allStrapiBlogs: { nodes }} = useStaticQuery(query);
    const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

    return (
        <React.Fragment>  
            <TopHeader hideBlog={true} />
            <PageBanner 
                bgText="Welcome to Max's Blog!" 
                pageTitle="Welcome to Max's Blog!" 
                homePageUrl="/" 
                homePageText="Home" 
                activePageText="Blog" 
            />

            <div id="blog" className="blog-area three pt-100 pb-70">
                <div className="container">
                    <div className="row">

                        {nodes.map((blog) => {
                            let fullDate = new Date(blog.date);
                            let date = fullDate.getDate();
                            let month = monthNames[fullDate.getMonth()];
                            let year = fullDate.getFullYear();

                            return (
                                <div className="col-sm-6 col-lg-4" key={blog.id}>
                                    <div className="blog-item">
                                        <div className="top">
                                            <Link to={`/blogs/${blog.slug}`}>
                                                <Image fluid={blog.image.childImageSharp.fluid} alt="Blog" />
                                            </Link>
                                            
                                            <h4>{("0"+date).slice(-2)} <span>{month}</span></h4>
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
                            );
                        })}

                    </div>
                </div>
            </div>
   
            <Footer />
        </React.Fragment>
    )
}

export default Blog