import React from 'react' 
import TopHeader from '../components/Common/TopHeader'
import PageBanner from '../components/Common/PageBanner'
import Footer from "../components/Common/Footer";
import { Link, graphql } from 'gatsby';
import { Index } from "lunr";
import BlogSearch from "../components/Blog/BlogSearch";
import Seo from "../components/App/seo";
import { GatsbyImage } from "gatsby-plugin-image";

import "../assets/styles/component-scope/Blog.scss";

const Blog = ({ data, location }) => {
    const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

    const params = new URLSearchParams(location.search.slice(1))
    const q = params.get("q") || ""
    const { store } = data.LunrIndex
    const index = Index.load(data.LunrIndex.index)
    let results = []
    try {
        results = index.search(q).map(({ ref }) => {
            
            // TODO: Could be improved
            // Workaround to get images working from local gatsby source.
            // Maping of blog.image.localFile___NODE to local gatsby image file
            let nodeMapped = data.allFile.edges.filter(obj => {
                return obj.node.id === store[ref].image.localFile___NODE;
            });
            store[ref].image.localFile = nodeMapped[0].node;
            //end mapping

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
            <Seo title="Tech Blog" description='Welcome to "The Tech Blog" by Max. Technical tutorials! Design tips! & Useful code snippets :)'/>
            <TopHeader/>
            <PageBanner
                bgText={title}
                pageTitle={title}
                homePageUrl="/"
                homePageText="Home"
                activePageText={activePage}
            />

            <div id="blog" className="blog-area pt-100 pb-70">
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

                                return (
                                    <div className="col-sm-6 col-lg-4" key={blog.id}>
                                        <div className="blog-item">
                                            <div className="top">
                                                <Link to={`/blog/${blog.slug}`}>
                                                    <GatsbyImage image={blog.image.localFile.childImageSharp.gatsbyImageData} alt={blog.image.alternativeText} />
                                                </Link>
                                                
                                                <div>{("0"+date).slice(-2)} <span>{month}</span></div>
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
    allFile {
      edges {
        node {
          id
          childImageSharp {
            id
            gatsbyImageData
          }
        }
      }
    }
  }
`;