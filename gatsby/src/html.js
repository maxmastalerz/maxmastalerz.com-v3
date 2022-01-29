import React from "react"
import PropTypes from "prop-types"
import Preloader from "./components/App/Preloader";

export default function HTML(props) {
  return (
    <html {...props.htmlAttributes}>
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />

        <style dangerouslySetInnerHTML={{ __html: `#preloader{position:fixed;top:0;left:0;width:100%;height:100%;z-index:99999;background:#171717}.preloader__wrapper{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:200px}.preloader__wrapper>h5{font-family:sans-serif;color:#4BFFA5;text-align:center}.preloader__circle{width:100%;height:90px;display:inline-block;z-index:99;position:relative;transition:.3s ease}.preloader__circle-line{animation:rotate 3.5s ease-in-out infinite;border-top:1px solid transparent;border-left:1px solid #4BFFA5;border-right:1px solid #4BFFA5;border-bottom:1px solid transparent;border-radius:50%;position:absolute;left:50%;top:50%}.preloader__circle-line--1{width:90px;height:90px;animation-duration:1s}.preloader__circle-line--2{width:80px;height:80px;animation-duration:2s}.preloader__circle-line--3{width:70px;height:70px;animation-duration:3s}.preloader__circle-line--4{width:60px;height:60px;animation-duration:4s}.preloader__circle-line--5{width:50px;height:50px;animation-duration:5s}.preloader__circle-line--6{width:40px;height:40px;animation-duration:6s}.preloader__circle-line--7{width:30px;height:30px;animation-duration:7s}.preloader__circle-line--8{width:20px;height:20px;animation-duration:8s}.preloader__circle-line--9{width:10px;height:10px;animation-duration:9s}.preloader__circle-line--10{width:0;height:0;animation-duration:10s}@keyframes rotate{from{transform:translate(-50%,-50%) rotate(0)}to{transform:translate(-50%,-50%) rotate(360deg)}}`}}/>

        <link rel="dns-prefetch preconnect" href="https://www.googletagmanager.com" crossorigin />

        {props.headComponents}
      </head>
      <body {...props.bodyAttributes}>
        {props.preBodyComponents}
        
        <Preloader />

        <div
          key={`body`}
          id="___gatsby"
          dangerouslySetInnerHTML={{ __html: props.body }}
        />
        {props.postBodyComponents}
      </body>
    </html>
  )
}

HTML.propTypes = {
  htmlAttributes: PropTypes.object,
  headComponents: PropTypes.array,
  bodyAttributes: PropTypes.object,
  preBodyComponents: PropTypes.array,
  body: PropTypes.string,
  postBodyComponents: PropTypes.array,
}
