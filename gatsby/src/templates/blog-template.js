import React, { useEffect } from 'react';
import TopHeader from '../components/Common/TopHeader';
import Footer from "../components/Common/Footer";
import { Link, graphql } from 'gatsby';
import ReactMarkdown from "react-markdown"
import Image from 'gatsby-image'
import BlogSearch from "../components/Blog/BlogSearch";

const insertScript = (src, id, parentElement) => {
    const script = window.document.createElement('script');
    script.defer = true;
    script.src = src;
    script.id = id;
    parentElement.appendChild(script);
    return script;
};
// Helper to remove scripts from our page
const removeScript = (id, parentElement) => {
    const script = window.document.getElementById(id);
    if (script) {
        parentElement.removeChild(script);
    }
};

const BlogDetails = ({ data, pageContext }) => {
    const previousBlog = pageContext.previous;
    const { title, date, long_desc, banner_image } = data.blog
    const nextBlog = pageContext.next;
    const recentBlogPosts = data.recentBlogs.nodes;

    const monthNames = ["January","February","March","April","May","June","July",
                        "August","September","October","November","December"];
    const fullDate = new Date(date);
    const dateNum = fullDate.getDate();
    const month = monthNames[fullDate.getMonth()];
    const year = fullDate.getFullYear();

    useEffect(() => {
        if (!window) { // If there's no window there's nothing to do for us
            return;
        }
        window.remark_config = {
            host: `${window.location.protocol}//remark42.${process.env.GATSBY_BASE_URL}`,
            site_id: process.env.GATSBY_BASE_URL,
            components: ['embed'],
            max_shown_comments: 10
        };
        const document = window.document;

        if (document.getElementById('remark42')) {
            insertScript(
                `${window.location.protocol}//remark42.${process.env.GATSBY_BASE_URL}/web/embed.js`,
                `remark42-script`,
                document.body
            );
        }

        return () => removeScript(`remark42-script`, document.body);
    }, []);

    return (
        <React.Fragment>
            <div id="blog" className="blog-details-area">
                <TopHeader seondLinkName="Blog" secondLinkUrl="/blog"/>
                <div className="container ptb-100">
                    <div className="details-img">
                        <Image fluid={banner_image.localFile.childImageSharp.fluid} />
                    </div>

                    <div className="row">
                        <div className="col-lg-8">
                            <div className="details-img-info">
                                <ul className="info">
                                    <li>By: <Link to="/">Max Mastalerz</Link></li>
                                    <li>{month} {dateNum}, {year}</li>
                                </ul>
                                <h2>{title}</h2>
                                <ReactMarkdown source={long_desc} />
                            </div>

                            <div className="details-pages">
                                <div className="row align-items-center">
                                    <div className="col-6 col-lg-6">
                                        {previousBlog && (
                                            <div className="pages-item">
                                                <Link className="pre-project" to={`/blogs/${previousBlog.slug}`}>
                                                    <i className="flaticon-right-arrow"></i> Previous Article
                                                </Link>
                                            </div>
                                        )}
                                    </div>

                                    <div className="col-6 col-lg-6">
                                        {nextBlog && (
                                            <div className="pages-item three">
                                                <Link className="next-project" to={`/blogs/${nextBlog.slug}`}>
                                                    Next Article <i className="flaticon-right-arrow"></i>
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            {/*<div className="details-comments">
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
                            </div>*/}

                            <div id="remark42"></div>
                        </div>

                        <div className="col-lg-4">
                            <div className="widget-area">
                                <div className="widget-item">
                                    {/*<form onSubmit={handleSearchSubmit}>
                                        <input name="search" type="text" className="form-control" placeholder="Search..." />
                                        <button type="submit" className="btn">
                                            <i className='bx bx-search-alt'></i>
                                        </button>
                                    </form>*/}
                                
                                    <BlogSearch />
                                </div>

                                <div className="recent widget-item">
                                    <h3>Recent Posts</h3>
                                        {recentBlogPosts.map((recentBlogPost) => {
                                            return (
                                                <div className="recent-inner" key={recentBlogPost.id}>
                                                    <ul className="align-items-center">
                                                        <li>
                                                            <Image fluid={recentBlogPost.image.localFile.childImageSharp.fluid} />
                                                        </li>
                                                        <li>
                                                            <Link to={`/blogs/${recentBlogPost.slug}`}>
                                                                <h3>{recentBlogPost.title}</h3>
                                                            </Link>
                                                            <Link to={`/blogs/${recentBlogPost.slug}`}>
                                                                Read More <i className="flaticon-right-arrow"></i>
                                                            </Link>
                                                        </li>
                                                    </ul>
                                                </div>
                                            );
                                        })}
                                </div>
                                {/*
                                <div className="tags widget-item">
                                    <h3>Tags</h3>
                                    <ul>
                                        <li>
                                            <a href="#">Design</a>
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
  query GetSingleBlogAndRecentBlogs($slug: String) {
    blog: strapiBlogs(slug: { eq: $slug }) {
        title
        date
        long_desc
        banner_image {
            localFile {
                childImageSharp {
                  fluid {
                    ...GatsbyImageSharpFluid
                  }
                }
            }
        }
    }

    recentBlogs: allStrapiBlogs(sort: {order: DESC, fields: created_at}, limit: 3, filter: {slug: {ne: $slug}}) {
      nodes {
        id
        title
        slug
        created_at
        image {
          localFile {
              childImageSharp {
                fluid {
                  ...GatsbyImageSharpFluid
                }
              }
          }
        }
      }
    }

  }
`;

export default BlogDetails