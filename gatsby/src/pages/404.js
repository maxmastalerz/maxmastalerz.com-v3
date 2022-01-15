import React from "react";
import Seo from "../components/App/seo";
import { Link } from "gatsby";

import "../assets/styles/component-scope/NotFoundPage.scss";

const NotFoundPage = () => (
	<div id="four-o-four-wrapper">
		<div id="four-o-four-content">
			<Seo title="404: Not found" />
				<h1 className="mb-3">Sorry, We Couldn't Find That Page :(</h1>
			<Link to="/">Go Home</Link>
		</div>
	</div>
);

export default NotFoundPage;
