/*import { createGlobalStyle } from '@nfront/global-styles';
import reset from '../styles/reset';
import globalStyle from '../styles/globalStyle';
 
const GlobalStyleComponent = createGlobalStyle`
  ${reset}
  ${globalStyle}
`;
 
export default GlobalStyleComponent;*/

import { createGlobalStyle } from '@nfront/global-styles';
import globalStylesArr from '!css-loader!sass-loader!../assets/styles/global-scope/scss/global.scss';

let globalStyles = "";

globalStylesArr.forEach(([,stylesheet]) => {
  globalStyles += stylesheet;
});

const GlobalStyleComponent = createGlobalStyle`
  ${globalStyles}
`;

export default GlobalStyleComponent;