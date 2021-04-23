import React from 'react'
import TopHeader from '../components/Blog/TopHeader'
import PageBanner from '../components/Common/PageBanner'
import Footer from '../components/Blog/Footer'
import {Link, graphql} from 'gatsby'
import ReactMarkdown from "react-markdown"
import Image from 'gatsby-image'
import blogImg5 from '../components/App/assets/images/blog/blog-thumb5.jpg'
import blogImg6 from '../components/App/assets/images/blog/blog-thumb6.jpg'
import blogImg7 from '../components/App/assets/images/blog/blog-thumb7.jpg'

const BlogDetails = ({ data }) => {
    const { title, long_desc, image } = data.blog
    return (
        <React.Fragment>  
            <TopHeader />
            <PageBanner 
                bgText="Blog Details" 
                pageTitle="Blog Details" 
                homePageUrl="/" 
                homePageText="Home" 
                activePageText={title}
            /> 

            <div id="blog" className="blog-details-area ptb-100">
                <div className="container">
                    <div className="details-img">
                        <Image fluid={image.childImageSharp.fluid} />
                    </div>

                    <div className="row">
                        <div className="col-lg-8">
                            <div className="details-img-info">
                                <ul className="info">
                                    <li>By: <a href="#">Adam Smith</a></li>
                                    <li>October 07, 2020</li>
                                    <li>2 Comments</li>
                                </ul>
                                <h2>{title}</h2>
                                <ReactMarkdown source={long_desc} />
                            </div>
                        </div>

                        <div className="col-lg-4">
                            <div className="widget-area">
                                <div className="search widget-item">
                                    <form>
                                        <input type="text" className="form-control" placeholder="Search..." />
                                        <button type="submit" className="btn">
                                            <i className='bx bx-search-alt'></i>
                                        </button>
                                    </form>
                                </div>

                                <div className="recent widget-item">
                                    <h3>Recent Post</h3>
                                    <div className="recent-inner">
                                        <ul className="align-items-center">
                                            <li>
                                                <img src={blogImg5} alt="Details" />
                                            </li>
                                            <li>
                                                <h3>How Design Became Fun In My Life</h3>
                                                <Link to="#">
                                                    Read More <i className="flaticon-right-arrow"></i>
                                                </Link>
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="recent-inner">
                                        <ul className="align-items-center">
                                            <li>
                                                <img src={blogImg6} alt="Details" />
                                            </li>
                                            <li>
                                                <h3>How Graphic Design Take The Place Of Next Generation</h3>
                                                <Link to="#">
                                                    Read More <i className="flaticon-right-arrow"></i>
                                                </Link>
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="recent-inner">
                                        <ul className="align-items-center">
                                            <li>
                                                <img src={blogImg7} alt="Details" />
                                            </li>
                                            <li>
                                                <h3>Old Tradition Of Art Are Changed Throughout These</h3>

                                                <Link to="#">
                                                    Read More <i className="flaticon-right-arrow"></i>
                                                </Link>
                                            </li>
                                        </ul>
                                    </div>
                                </div>  

                                <div className="tags widget-item">
                                    <h3>Tags</h3>
                                    <ul>
                                        <li>
                                            <a href="#">Design</a>
                                        </li>
                                        <li>
                                            <a href="#">Graphic Design</a>
                                        </li>
                                        <li>
                                            <a href="#">Art</a>
                                        </li>
                                        <li>
                                            <a href="#">Success</a>
                                        </li>
                                        <li>
                                            <a href="#">Trend</a>
                                        </li>
                                        <li>
                                            <a href="#">Skills</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
 
            <Footer />
        </React.Fragment>
    )
}

export const query = graphql`
  query GetSingleBlog($slug: String) {
    blog: strapiBlogs(slug: { eq: $slug }) {
        title
        long_desc
        image {
            childImageSharp {
              fluid {
                ...GatsbyImageSharpFluid
              }
            }
        }
    }
  }
`

export default BlogDetails