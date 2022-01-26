import React, { useEffect } from 'react';
import TopHeader from '../components/Common/TopHeader';
import Footer from "../components/Common/Footer";
import { Link, graphql } from 'gatsby';
import { GatsbyImage } from "gatsby-plugin-image";
import BlogSearch from "../components/Blog/BlogSearch";
import useScript from 'react-script-hook';
import { Helmet } from "react-helmet";
import usefulUrls from '../utils/usefulUrls';
import InTextAd from '../components/BlogArticle/InTextAd';

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

/*Get nth occurence of something(substr) in a string*/
const nthIndex = (string, substr, n) => {
    var L= string.length, i= -1;
    while(n-- && i++<L){
        i= string.indexOf(substr, i);
        if (i < 0) break;
    }
    return i;
}

/*
In a text, get the location immediately after a closing </p> tag at which we can split the article to inserts ads
This location won't be of the first closing p tag we come across but of at least the nth(aka the minPTagOffset).
This function gets us a closing p tag which is NOT followed immediately after a <code> block. This is so that
ads only fit in between text content blocks rather than popping up where you wouldn't expect an ad to be placed.
*/
const getNextPSplitLocation = (text, minPTagOffset) => {
        let pTagOffset = minPTagOffset;
    let closingPLocation = -1;
    let lookingForClosingPLocation = true;
        while(lookingForClosingPLocation) {
        closingPLocation = nthIndex(text, '</p>', pTagOffset);
        if(closingPLocation === -1) {
                break; //desired closing p tag not found in the desired nth position or onwards
        }
        closingPLocation += '</p>'.length; //+4

        if(closingPLocation >= text.length) {
          //if the closing p tag we found is the end of the article, we don't want ads.
          closingPLocation = -1; //mark as not found.
          break;
        }
        let closingPLocationOnwards = text.substring(closingPLocation, text.length);
        let nextClosingTag =  nthIndex(closingPLocationOnwards, '</', 1);
        let nextOpeningCodeTag = nthIndex(closingPLocationOnwards, '<code', 1);
        if(nextOpeningCodeTag === -1) {
          //If no code tag follows just asume it's at the furthest possible location ahead
          nextOpeningCodeTag = Infinity;
        }
        if(nextClosingTag === -1) {
          nextClosingTag = Infinity;
        }
        if(nextClosingTag > nextOpeningCodeTag) { //This happens if the paragraph ended right before a <code> chunk begins. We don't want to place ads on such a border
          pTagOffset++;
        } else {
          lookingForClosingPLocation = false; //Found a closing tag location that isn't right before a <code> chunk.
        }
    }
    
    return closingPLocation; //returns location immediately after </p>
}

/*
Split cms content such that we can put ads in between the split sections
Can return 1 part(no ads), 2 parts(ad will go in the middle), or 3 parts(2 ads will load)
*/
const splitSection = (section) => {
    let firstClosingPLocation = getNextPSplitLocation(section, 3);
    if(firstClosingPLocation === -1) { // If not even one desired paragraph closing tag was found, don't split - aka don't bother showing ads
        return [section];
    }
    
    const sectionAfterFirstClosingP = section.substring(firstClosingPLocation, section.length);
    console.log(sectionAfterFirstClosingP);
    let secondClosingPLocation = getNextPSplitLocation(sectionAfterFirstClosingP, 9);
    
    if(secondClosingPLocation === -1) { //If only one acceptable p closing tag was found
        const splitPartOne = section.substring(0, firstClosingPLocation);
        const splitPartTwo = section.substring(firstClosingPLocation, section.length);
        return [splitPartOne, splitPartTwo];
    }
    
    const splitPartOne = section.substring(0, firstClosingPLocation);
    const splitPartTwo = sectionAfterFirstClosingP.substring(0, secondClosingPLocation);
    const splitPartThree = sectionAfterFirstClosingP.substring(secondClosingPLocation, sectionAfterFirstClosingP.length);
    return [splitPartOne, splitPartTwo, splitPartThree];
};

const BlogArticle = ({ data, pageContext }) => {
    const previousBlog = pageContext.previous;
    const nextBlog = pageContext.next;

    const { title, date, long_desc, banner_image, image_alt } = data.blog;
    const googleAdSlots = ["4919336957", "4646329625"]; //google adsense ad slot ids
    const articleParts = splitSection(long_desc);
    let banner_image_alt_attr = (image_alt !== null) ? image_alt : "";
    
    const recentBlogPosts = data.recentBlogs.nodes;

    const monthNames = ["January","February","March","April","May","June","July",
                        "August","September","October","November","December"];
    const fullDate = new Date(date);
    const dateNum = fullDate.getDate();
    const month = monthNames[fullDate.getMonth()];
    const year = fullDate.getFullYear();

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

        //ADSENSE
        const googleAdsElem = window.document.createElement("script");
        googleAdsElem.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9353388001568852";
        googleAdsElem.async = true;
        googleAdsElem.defer = true;
        googleAdsElem.crossorigin = "anonymous";
        window.document.body.insertBefore(googleAdsElem, window.document.body.firstChild);

        //REMARK42
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

        return () => {
            googleAdsElem.remove();
            removeScript(`remark42-script`, document.body)
        };
    }, []);

    return (
        <React.Fragment>
            <Helmet>
                <link rel="stylesheet" href="/highlight/styles/monokai-sublime.css"/>
            </Helmet>
            <div id="blog" className="blog-details-area">
                <TopHeader seondLinkName="Blog" secondLinkUrl="/blog"/>
                <div className="page-content container">
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

                                {articleParts.map((articlePart, i) => {
                                    return (
                                        <>
                                            <div className="cms-content" dangerouslySetInnerHTML={{__html: articlePart}} />
                                            { i !== articleParts.length-1 &&
                                                <InTextAd slot={googleAdSlots[i]}/>
                                            }
                                        </>
                                    );
                                })}
                                
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