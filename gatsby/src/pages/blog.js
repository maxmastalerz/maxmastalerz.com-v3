import React from 'react' 
import TopHeader from '../components/Common/TopHeader'
import PageBanner from '../components/Common/PageBanner'
import Footer from "../components/Common/Footer";
import { Link, graphql } from 'gatsby';
import { Index } from "lunr";
import BlogSearch from "../components/Blog/BlogSearch";

import "../assets/styles/component-scope/css/Blog.css";

const Blog = ({ data, location }) => {
    const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

    const params = new URLSearchParams(location.search.slice(1))
    const q = params.get("q") || ""
    const { store } = data.LunrIndex
    const index = Index.load(data.LunrIndex.index)
    let results = []
    try {
        results = index.search(q).map(({ ref }) => {
            return {
                slug: ref,
                ...store[ref],
            }
        })
    } catch (error) {
        console.log(error)
    }

    let title = "Welcome to Max's Blog!";
    let activePage = "Blog";
    if(params.get("q") !== null) {
        activePage = "Search";
        if(results.length > 0) {
            title = "Here's What We Found"
        } else {
            title = "Sorry, No Results Found."
        }
    }

    return (
        <React.Fragment>  
            <TopHeader/>

            <PageBanner
                bgText={title}
                pageTitle={title}
                homePageUrl="/"
                homePageText="Home"
                activePageText={activePage}
            />

            <div id="blog" className="blog-area three pt-100 pb-70">
                <div className="container">
                    <div className="mb-4">
                        <BlogSearch/>
                    </div>

                    <div className="row">
                        {(
                            results.map(blog => {
                                let fullDate = new Date(blog.date);
                                let date = fullDate.getDate();
                                let month = monthNames[fullDate.getMonth()];

                                let blogImg = (blog.image.formats.small !== undefined ? blog.image.formats.small.url : blog.image.formats.thumbnail.url);
                                if(blogImg[0] === "/") {
                                    blogImg = `/api${blogImg}`;
                                }

                                return (
                                    <div className="col-sm-6 col-lg-4" key={blog.id}>
                                        <div className="blog-item">
                                            <div className="top">
                                                <Link to={`/blog/${blog.slug}`}>
                                                    <img src={blogImg} alt={blog.image.alternativeText} />
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
                                )
                            })
                        )}
                    </div>
                </div>
            </div>
   
            <Footer />
        </React.Fragment>
    )
}

export default Blog

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    LunrIndex
  }
`;