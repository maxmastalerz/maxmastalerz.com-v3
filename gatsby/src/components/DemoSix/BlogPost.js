import React from 'react'
import { Link } from 'gatsby'
import blog7 from '../../components/App/assets/images/blog/blog7.jpg'
import blog8 from '../../components/App/assets/images/blog/blog8.jpg'
import blog9 from '../../components/App/assets/images/blog/blog9.jpg'

const BlogPost = () => {
    return (
        <div id="blog" className="blog-area six ptb-100">
            <div className="container">
                <div className="section-title six">
                    <span className="sub-title">BLOG</span>
                    <h2>Here Are Some <span>Writings</span> Which Will Give You Better Idea</h2>
                </div>

                <div className="row">
                    <div className="col-sm-6 col-lg-4">
                        <div className="blog-item">
                            <div className="top">
                                <Link to="/blog-details">
                                    <img src={blog7} alt="Blog" />
                                </Link>

                                <h4>12 <span>Oct</span></h4>
                            </div>
                            <div className="bottom">
                                <h3>
                                    <Link to="/blog-details">
                                        How To Improve Design Skill & Manage Design Work
                                    </Link>
                                </h3>
                                <p>Lorem ipsum dolor sit amet, consete tur sadipscing elitr, sed diam nonumy eirmod tempor invidunt</p>

                                <Link to="/blog-details" className="blog-btn">
                                    Read More <i className="flaticon-right-arrow"></i>
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="col-sm-6 col-lg-4">
                        <div className="blog-item">
                            <div className="top">
                                <Link to="/blog-details">
                                    <img src={blog8} alt="Blog" />
                                </Link>
                                <h4>13 <span>Oct</span></h4>
                            </div>
                            <div className="bottom">
                                <h3>
                                    <Link to="/blog-details">
                                        <a target="_blank">How To Solve Design Problem Within Few Hours</a>
                                    </Link>
                                </h3>
                                <p>Lorem ipsum dolor sit amet, consete tur sadipscing elitr, sed diam nonumy eirmod tempor invidunt</p>
                                
                                <Link to="/blog-details" className="blog-btn">
                                    Read More <i className="flaticon-right-arrow"></i>
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="col-sm-6 offset-sm-3 offset-lg-0 col-lg-4">
                        <div className="blog-item">
                            <div className="top">
                                <Link to="/blog-details">
                                    <img src={blog9} alt="Blog" />
                                </Link>
                                <h4>14 <span>Oct</span></h4>
                            </div>
                            <div className="bottom">
                                <h3>
                                    <Link to="/blog-details">
                                        Old Tradition Of Art Is Changed Throughout These Years
                                    </Link>
                                </h3>
                                <p>Lorem ipsum dolor sit amet, consete tur sadipscing elitr, sed diam nonumy eirmod tempor invidunt</p>
                                
                                <Link href="/blog-details" className="blog-btn">
                                    Read More <i className="flaticon-right-arrow"></i>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="text-center">
                    <Link to="/blog" className="common-btn six">
                        Explore Blog
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default BlogPost