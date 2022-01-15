/**
 * Implement Gatsby's Browser APIs in this file.
 * Browser API
 * See: https://www.gatsbyjs.com/docs/browser-apis/
 */

//Load global fonts


/*
Original CSS did this:
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

What I noticed actually being used:
Poppins: 400, 700
Open Sans: 400, 600, 700

Added fonts here to preload them(vs using the stylesheet method):
*/
import "@fontsource/poppins/latin-400.css";
import "@fontsource/poppins/latin-700.css";
import "@fontsource/open-sans/latin-400.css"
import "@fontsource/open-sans/latin-600.css"
import "@fontsource/open-sans/latin-700.css"

import './src/assets/styles/global-scope/_bootstrap-overrides.scss';
import './src/assets/styles/global-scope/_boxicons.min.scss';
import './src/assets/styles/global-scope/_theme.scss';
import './src/assets/styles/global-scope/_theme.responsive.scss';

export const onInitialClientRender = () => {
    document.getElementById("preloader").remove();
};