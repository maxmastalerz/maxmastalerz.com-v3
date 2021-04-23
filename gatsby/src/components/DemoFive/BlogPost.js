import React from 'react'
import { Link } from 'gatsby'
import blog from '../../components/App/assets/images/blog/blog6.jpg'
import blogThumb1 from '../../components/App/assets/images/blog/blog-thumb1.jpg'
import blogThumb2 from '../../components/App/assets/images/blog/blog-thumb2.jpg'
import blogThumb3 from '../../components/App/assets/images/blog/blog-thumb3.jpg'
import blogThumb4 from '../../components/App/assets/images/blog/blog-thumb4.jpg'

const BlogPost = () => {
    return (
        <div id="blog" className="blog-area five pb-70">
            <div className="container">
                <div className="section-title five">
                    <h2>Here Are Some <span>Writings</span> Which Will Give You Better Idea</h2>
                </div>

                <div className="row">
                    <div className="col-lg-6">
                        <div className="blog-item">
                            <div className="top">
                                <Link to="/blog-details">
                                    <img src={blog} alt="Blog" />
                                </Link>
                                <h4>12 <span>Oct</span></h4>
                            </div>
                            <div className="bottom">
                                <h3>
                                    <Link to="/blog-details">
                                        How To Improve Design Sense & Skill To Manage Design Work Efficiently & Make Client Happy
                                    </Link>
                                </h3>
                                <p>Lorem ipsum dolor sit amet, consete tur sadipscing elitr, sed diam nonumy eirmod tempor invidunt.dolore magna aliquyam erat</p>
                                
                                <Link to="/blog-details" className="blog-btn">
                                    Read More <i className="flaticon-right-arrow"></i>
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-6">
                        <div className="blog-thumb-item">
                            <ul className="align-items-center">
                                <li>
                                    <span>13 Oct</span>
                                    <img src={blogThumb1} alt="Blog" />
                                </li>
                                <li>
                                    <h3>
                                        <Link to="/blog-details">
                                            How Design Became Fun In My Life & Took The Empty
                                        </Link>
                                    </h3>
                                    <Link to="/blog-details" className="blog-btn">
                                        Read More <i className="flaticon-right-arrow"></i>
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        <div className="blog-thumb-item">
                            <ul className="align-items-center">
                                <li>
                                    <span>14 Oct</span>
                                    <img src={blogThumb2} alt="Blog" />
                                </li>
                                <li>
                                    <h3>
                                        <Link to="/blog-details">
                                            How Graphic Design Take The Place Of Next Generation
                                        </Link>
                                    </h3>
                                    <Link to="/blog-details" className="blog-btn">
                                        Read More <i className="flaticon-right-arrow"></i>
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        <div className="blog-thumb-item">
                            <ul className="align-items-center">
                                <li>
                                    <span>15 Oct</span>
                                    <img src={blogThumb3} alt="Blog" />
                                </li>
                                <li>
                                    <h3>
                                        <Link to="/blog-details">
                                            Age Old Tradition Of Art Are Changed Throughout These
                                        </Link>
                                    </h3>
                                    <Link to="/blog-details" className="blog-btn">
                                        Read More <i className="flaticon-right-arrow"></i>
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        <div className="blog-thumb-item">
                            <ul className="align-items-center">
                                <li>
                                    <span>16 Oct</span>
                                    <img src={blogThumb4} alt="Blog" />
                                </li>
                                <li>
                                    <h3>
                                        <Link to="/blog-details">
                                            How To Become A Pro Level Graphic Designer For Work
                                        </Link>
                                    </h3>
                                    <Link to="/blog-details" className="blog-btn">
                                        Read More <i className="flaticon-right-arrow"></i>
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BlogPost