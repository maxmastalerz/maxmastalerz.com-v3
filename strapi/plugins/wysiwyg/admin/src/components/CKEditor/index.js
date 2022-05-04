import React from 'react';
import PropTypes from 'prop-types';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import FullEditor from '@blowstack/ckeditor5-full-free-build';
import styled from 'styled-components';

const Wrapper = styled.div`
  .ck-editor__main {
    min-height: 200px;
    > div {
      min-height: 200px;
    }
  }
`;

const configuration = {
  toolbar: [
    'alignment',
    'heading',
    '|',
    'bold',
    'italic',
    'underline',
    'strikethrough',
    'link',
    'bulletedList',
    'numberedList',
    '|',
    'indent',
    'outdent',
    '|',
    'blockQuote',
    'code',
    'codeBlock',
    'insertTable',
    'mediaEmbed',
    'undo',
    'redo',
    'pageBreak',
    'paragraph',
    'indent',
    'indentBlock',
    'fontSize',
    'fontColor',
    'horizontalLine',
    'highlight'
  ],
  removePlugins: [ 'Title' ],
  mediaEmbed: {
      extraProviders: [
          {
              name: 'daavgqhmwmui1.cloudfront.net',
              url: /^https?:\/\/daavgqhmwmui1\.cloudfront\.net\/(.+)\.(mp4|webm|ogg|avi|wmv|mpg|mpeg)/,
              html: (match) => {
                return
                `<div style="position:relative; padding-bottom:100%; height:0">` +
                  `<iframe src="${match[0]}" frameborder="0" style="position:absolute; width:100%; height:100%; top:0; left:0"></iframe>` +
                `</div>`;
              }
          }
      ]
  }
};

const Editor = ({ onChange, name, value }) => {
  return (
    <Wrapper>
      <CKEditor
        editor={FullEditor}
        config={configuration}
        data={value}
        onReady={editor => editor.setData(value)}
        onChange={(event, editor) => {
          const data = editor.getData();
          onChange({ target: { name, value: data } });
        }}
      />
    </Wrapper>
  );
};

Editor.propTypes = {
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
};

export default Editor;