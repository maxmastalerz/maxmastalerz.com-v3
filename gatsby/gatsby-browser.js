/**
 * Implement Gatsby's Browser APIs in this file.
 * Browser API
 * See: https://www.gatsbyjs.com/docs/browser-apis/
 */

import "./src/assets/styles/global-scope/fonts.scss"; //Define global fonts - some are preloaded in components/App/seo.js
import './src/assets/styles/global-scope/_bootstrap-overrides.scss';
import './src/assets/styles/global-scope/_boxicons.min.scss';
import './src/assets/styles/global-scope/_theme.scss';
import './src/assets/styles/global-scope/_theme.responsive.scss';

export const onInitialClientRender = () => {
    document.getElementById("preloader").remove();
};