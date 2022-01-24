import React, { useEffect } from 'react';
import TopHeader from '../components/Common/TopHeader';
import Footer from "../components/Common/Footer";
import { Link, graphql } from 'gatsby';
import { GatsbyImage } from "gatsby-plugin-image";
import BlogSearch from "../components/Blog/BlogSearch";
import useScript from 'react-script-hook';
import { Helmet } from "react-helmet";
import usefulUrls from '../utils/usefulUrls';

import "../assets/styles/component-scope/BlogArticle.scss";
import "../assets/styles/component-scope/BlogArticle.responsive.scss";

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

const BlogArticle = ({ data, pageContext }) => {
    const previousBlog = pageContext.previous;
    const nextBlog = pageContext.next;

    const { title, date, long_desc, banner_image, image_alt } = data.blog;
    let banner_image_alt_attr = (image_alt !== null) ? image_alt : "";
    
    const recentBlogPosts = data.recentBlogs.nodes;

    const monthNames = ["January","February","March","April","May","June","July",
                        "August","September","October","November","December"];
    const fullDate = new Date(date);
    const dateNum = fullDate.getDate();
    const month = monthNames[fullDate.getMonth()];
    const year = fullDate.getFullYear();

    useEffect(() => {
        const elem = document.createElement("script");
        elem.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9353388001568852";
        elem.async = true;
        elem.defer = true;
        elem.crossorigin = "anonymous";
        document.body.insertBefore(elem, document.body.firstChild);

        (window.adsbygoogle = window.adsbygoogle || []).push({});

        return () => {
            elem.remove();
        };
    }, []);

    useScript({ src: '/oEmbed-init.js' });

    const [loadingHighlightJS, ] = useScript({ src: '/highlight/highlight.pack.js' });
    useEffect(() => {
        if(!loadingHighlightJS) {
            window.hljs.highlightAll();
        }
    }, [loadingHighlightJS]);

    useEffect(() => {
        if (!window) { // If there's no window there's nothing to do for us
            return;
        }
        window.remark_config = {
            host: usefulUrls.remark42,
            site_id: window.location.host,
            components: ['embed'],
            max_shown_comments: 10
        };
        const document = window.document;

        if (document.getElementById('remark42')) {
            insertScript(
                `${usefulUrls.remark42}/web/embed.js`,
                `remark42-script`,
                document.body
            );
        }

        return () => removeScript(`remark42-script`, document.body);
    }, []);

    return (
        <React.Fragment>
            <Helmet>
                <link rel="stylesheet" href="/highlight/styles/monokai-sublime.css"/>
            </Helmet>
            <div id="blog" className="blog-details-area">
                <TopHeader seondLinkName="Blog" secondLinkUrl="/blog"/>
                <div className="container ptb-100">
                    <div className="details-img">
                        <GatsbyImage image={banner_image.localFile.childImageSharp.gatsbyImageData} alt={banner_image_alt_attr} />
                    </div>

                    <div className="row">
                        <div className="col-lg-8">
                            <div className="details-img-info">
                                <ul className="info">
                                    <li>By: <Link to="/">Max Mastalerz</Link></li>
                                    <li>{month} {dateNum}, {year}</li>
                                </ul>
                                <h2>{title}</h2>
                                <div className="cms-content" dangerouslySetInnerHTML={{__html: long_desc}} />
                            </div>

                            <div className="details-pages">
                                <div className="row align-items-center">
                                    <div className="col-6 col-lg-6">
                                        {previousBlog && (
                                            <div className="pages-item">
                                                <Link className="pre-project" to={`/blog/${previousBlog.slug}`}>
                                                    <i className="bx bxs-right-arrow"></i> Previous Article
                                                </Link>
                                            </div>
                                        )}
                                    </div>

                                    <div className="col-6 col-lg-6">
                                        {nextBlog && (
                                            <div className="pages-item three">
                                                <Link className="next-project" to={`/blog/${nextBlog.slug}`}>
                                                    Next Article <i className="bx bxs-right-arrow"></i>
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
                                            let recent_blog_image_alt = (recentBlogPost.image_alt !== null) ? recentBlogPost.image_alt : "";
                                            
                                            return (
                                                <div className="recent-inner" key={recentBlogPost.id}>
                                                    <ul className="align-items-center">
                                                        <li>
                                                            <GatsbyImage image={recentBlogPost.image.localFile.childImageSharp.gatsbyImageData} alt={recent_blog_image_alt}/>
                                                        </li>
                                                        <li>
                                                            <Link to={`/blog/${recentBlogPost.slug}`}>
                                                                <h3>{recentBlogPost.title}</h3>
                                                            </Link>
                                                            <Link to={`/blog/${recentBlogPost.slug}`}>
                                                                Read More <i className="bx bxs-right-arrow"></i>
                                                            </Link>
                                                        </li>
                                                    </ul>
                                                </div>
                                            );
                                        })}
                                </div>
                                <div className="widget-item">
                                    {/*<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9353388001568852" crossorigin="anonymous"></script>*/}
                                    <ins class="adsbygoogle" style={{display: 'block'}} data-ad-client="ca-pub-9353388001568852" data-ad-slot="9393165943" data-ad-format="auto" data-full-width-responsive="true"></ins>
                                    {/*<script> (adsbygoogle = window.adsbygoogle || []).push({}); </script>*/}
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
    );
}

export const query = graphql`query GetSingleBlogAndRecentBlogs($slug: String) {
  blog: strapiBlogs(slug: {eq: $slug}) {
    title
    date
    long_desc
    banner_image {
      localFile {
        childImageSharp {
          gatsbyImageData(layout: FULL_WIDTH)
        }
      }
    }
    image_alt
  }
  recentBlogs: allStrapiBlogs(
    sort: {order: DESC, fields: created_at}
    limit: 3
    filter: {slug: {ne: $slug}}
  ) {
    nodes {
      id
      title
      slug
      created_at
      image {
        localFile {
          childImageSharp {
            gatsbyImageData(layout: FULL_WIDTH)
          }
        }
      }
      image_alt
    }
  }
}
`;

export default BlogArticle