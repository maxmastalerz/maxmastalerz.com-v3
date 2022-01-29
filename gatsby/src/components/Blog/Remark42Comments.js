/* src/components/search-form.js */
import React, {useEffect} from "react";
import usefulUrls from '../../utils/usefulUrls';

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

const Remark42Comments = () => {

  useEffect(() => {
      if (!window) { // If there's no window there's nothing to do for us
          return;
      }

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
          removeScript(`remark42-script`, document.body)
      };
  }, []);

  return (
    <div id="remark42"></div>
  )
}

export default Remark42Comments;

