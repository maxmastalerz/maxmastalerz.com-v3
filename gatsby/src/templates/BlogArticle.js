import React, { useEffect, useState, useRef } from 'react';
import TopHeader from '../components/Common/TopHeader';
import Footer from "../components/Common/Footer";
import { Link, graphql } from 'gatsby';
import { GatsbyImage } from "gatsby-plugin-image";
import BlogSearch from "../components/Blog/BlogSearch";
import useScript from 'react-script-hook';
import { Helmet } from "react-helmet";
import InTextAd from '../components/BlogArticle/InTextAd';
import Seo from "../components/App/seo";
import Remark42Comments from "../components/Blog/Remark42Comments";

import "../assets/styles/component-scope/BlogArticle.scss";
import "../assets/styles/component-scope/BlogArticle.responsive.scss";

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
    if(typeof window === "undefined") {
        return [section];
    }

    let firstClosingPLocation = getNextPSplitLocation(section, 3);
    // If not even one desired paragraph closing tag was found, don't split - aka don't bother showing ads
    // Also, if on large mobile and smaller, don't show ads to improve performance.
    if(firstClosingPLocation === -1 || window.innerWidth <= 425) {
        return [section];
    }
    
    const sectionAfterFirstClosingP = section.substring(firstClosingPLocation, section.length);
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

const tryRenderingAds = (articleParts) => {
    let googleAdsElem = null;
    if(articleParts.length > 1) {
        googleAdsElem = window.document.createElement("script");
        googleAdsElem.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9353388001568852";
        googleAdsElem.async = true;
        googleAdsElem.defer = true;
        googleAdsElem.crossorigin = "anonymous";
        window.document.body.insertBefore(googleAdsElem, window.document.body.firstChild);
    }

    return googleAdsElem;
};

const monthNames = ["January","February","March","April","May","June","July",
                        "August","September","October","November","December"];
const googleAdSlots = ["4919336957", "4646329625"]; //google adsense ad slot ids

const BlogArticle = ({ data, pageContext }) => {
    const [displayRemark42Comments, setDisplayRemark42Comments] = useState(false);
    const hasAttemptedAdRender = useRef(false);
    useScript({ src: '/oEmbed-init.js' });
    useScript({
        src: '/prism/prism.js',
        onload: () => {
            window.Prism.highlightAll();
        }
    });

    const previousBlog = pageContext.previous;
    const nextBlog = pageContext.next;

    const { title, date, short_desc, long_desc, banner_image, image_alt } = data.blog;
    
    const articleParts = splitSection(long_desc);
    let banner_image_alt_attr = (image_alt !== null) ? image_alt : "";
    
    const recentBlogPosts = data.recentBlogs.nodes;

    const fullDate = new Date(date);
    const dateNum = fullDate.getDate();
    const month = monthNames[fullDate.getMonth()];
    const year = fullDate.getFullYear();

    useEffect(() => {
        //ADSENSE
        let googleAdsElem = null;
        if(hasAttemptedAdRender.current === false) {
            googleAdsElem = tryRenderingAds(articleParts);
            hasAttemptedAdRender.current = true;
        }

        return () => {
            if(googleAdsElem) {
                googleAdsElem.remove();
            }
        }
    }, [articleParts]);

    useEffect(() => {
        if(window.scrollY !== 0) {
            setDisplayRemark42Comments(true);
        }

        const handleOneTimeScroll = () => {
            setDisplayRemark42Comments(true);
            window.removeEventListener('scroll', handleOneTimeScroll);
        };

        window.addEventListener('scroll', handleOneTimeScroll);

        return () => {
            window.removeEventListener('scroll', handleOneTimeScroll);
        };
    }, []);

    return (
        <>
            <Seo title={title} description={short_desc}/>
            <Helmet>
                <link rel="stylesheet" href="/prism/prism.css"/>
            </Helmet>
            <div id="blog" className="blog-details-area">
                <TopHeader seondLinkName="Blog" secondLinkUrl="/blog"/>
                <div className="page-content container">
                    <div className="details-img">
                        <GatsbyImage image={banner_image.localFile.childImageSharp.gatsbyImageData} alt={banner_image_alt_attr} loading="eager"/>
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

                            { displayRemark42Comments ?
                                <Remark42Comments />
                            :
                                <div id="remark42-comments-placeholder">LOADING COMMENTS</div>
                            }
                        </div>

                        <div className="col-lg-4">
                            <div className="widget-area">
                                <div className="widget-item">
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
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div> 
        </>
    );
}

export const query = graphql`query GetSingleBlogAndRecentBlogs($slug: String) {
  blog: strapiBlogs(slug: {eq: $slug}) {
    title
    date
    short_desc
    long_desc
    banner_image {
      localFile {
        childImageSharp {
          gatsbyImageData(
            width: 1110
            quality: 60
          )
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
            gatsbyImageData(
                width: 128
                quality: 60
            )
          }
        }
      }
      image_alt
    }
  }
}
`;

export default BlogArticle