import React from "react";
import SEO from "../components/App/seo";
import { Link } from "gatsby";

const NotFoundPage = () => (
  <div id="four-o-four-wrapper">
  	<div id="four-o-four-content">
	    <SEO title="404: Not found" />
	    <h1 class="mb-3">Sorry, We Couldn't Find That Page :(</h1>
	    <Link to="/">Go Home</Link>
    </div>
  </div>
)

export default NotFoundPage
