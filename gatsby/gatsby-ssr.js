/**
 * Implement Gatsby's SSR (Server Side Rendering) APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/ssr-apis/
 */

//Move global styles to very top of the head.
//We are not using gatsby-plugin-global-styles for this as it does not work with purge css.
//Our global stylesheet includes Bootstrap which has a header comment that helps us find it.
export const onPreRenderHTML = ({ getHeadComponents, replaceHeadComponents }) => {
    const headComponents = getHeadComponents();
    for(const [idx, component] of headComponents.entries()) {
        if(component.type === "style" && /^.*Bootstrap/mi.test(component.props.dangerouslySetInnerHTML.__html) ) {
            headComponents.splice(idx, 1);
            headComponents.unshift(component);
            break;
        }
    }
    replaceHeadComponents(headComponents);
};