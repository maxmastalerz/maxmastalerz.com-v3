import React from 'react'
import TopHeader from '../components/Blog/TopHeader'
import Footer from "../components/DemoThree/Footer";
import {Link, graphql} from 'gatsby'
import ReactMarkdown from "react-markdown"
import Image from 'gatsby-image'
import blogImg5 from '../components/App/assets/images/blog/blog-thumb5.jpg'
import blogImg6 from '../components/App/assets/images/blog/blog-thumb6.jpg'
import blogImg7 from '../components/App/assets/images/blog/blog-thumb7.jpg'

const BlogDetails = ({ data }) => {
    const { date, title, long_desc, banner_image } = data.blog
    return (
        <React.Fragment>  
            
            <div id="blog" className="blog-details-area">
                <TopHeader />
                <div className="container ptb-100">
                    <div className="details-img">
                        <Image fluid={banner_image.childImageSharp.fluid} />
                    </div>

                    <div className="row">
                        <div className="col-lg-8">
                            <div className="details-img-info">
                                <ul className="info">
                                    <li>By: <Link to="/">Max Mastalerz</Link></li>
                                    <li>{date}</li>
                                    <li>2 Comments</li>
                                </ul>
                                <h2>{title}</h2>
                                <ReactMarkdown source={long_desc} />
                            </div>

                            <div className="details-pages">
                                <div className="row align-items-center">
                                    <div className="col-6 col-lg-6">
                                        <div className="pages-item">
                                            <a className="pre-project" href="#">
                                                <i className="flaticon-right-arrow"></i> Previous Article
                                            </a>
                                        </div>
                                    </div>

                                    <div className="col-6 col-lg-6">
                                        <div className="pages-item three">
                                            <a className="next-project" href="#">
                                                Next Article <i className="flaticon-right-arrow"></i>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="details-comments">
                                <h3>Comments <span>(02)</span></h3>
                                <ul>
                                    <li>
                                        <img src="/images/blog/comment1.jpg" alt="Comment" />
                                        <h4>Adam Smith</h4>
                                        <span>October 10, 2020</span>
                                        <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Accusamus ratione neque architecto modi facere provident dolore optio, perferendis</p>
                                        <a href="#">Reply</a>
                                    </li>
                                    <li>
                                        <img src="/images/blog/comment2.jpg" alt="Comment" />
                                        <h4>Tom Henry</h4>
                                        <span>October 11, 2020</span>
                                        <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Accusamus ratione neque architecto modi facere provident dolore optio, perferendis</p>
                                        <a href="#">Reply</a>
                                    </li>
                                </ul>
                            </div>

                            <div className="details-leave">
                                <h3>Leave A Comment</h3>
                                <form>
                                    <div className="form-group">
                                        <input type="text" className="form-control" placeholder="Name" />
                                    </div>
                                    <div className="form-group">
                                        <input type="email" className="form-control" placeholder="Email" />
                                    </div>
                                    <div className="form-group">
                                        <textarea id="your-comments" rows="8" className="form-control" placeholder="Comments"></textarea>
                                    </div>
                                    <button type="submit" className="btn common-btn three">Post A Comment</button>
                                </form>
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
                                {/*
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
                                */}
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
 
            
        </React.Fragment>
    )
}

export const query = graphql`
  query GetSingleBlog($slug: String) {
    blog: strapiBlogs(slug: { eq: $slug }) {
        title
        date
        long_desc
        banner_image {
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