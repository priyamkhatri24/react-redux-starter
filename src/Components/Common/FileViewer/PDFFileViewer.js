import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import WebViewer from '@pdftron/pdfjs-express-viewer';
import { getParams } from '../../../Utilities';

let key = '';
if (process.env.NODE_ENV === 'development') {
  key = 'q1oxn6WyDRc572siUU5z';
} else if (process.env.NODE_ENV === 'production' && window.location.origin.includes('askilc')) {
  key = 'BcBf29XSXBiPpBpG66JY';
} else if (
  process.env.NODE_ENV === 'production' &&
  window.location.origin.includes('physicsmantra')
) {
  key = 'TTKeN7IQEvXriGIHM8rC';
} else if (process.env.NODE_ENV === 'production' && window.location.origin.includes('rypmindia')) {
  key = 'o1HgM8bBaqhaZtnK3ZIa';
} else if (
  process.env.NODE_ENV === 'production' &&
  window.location.origin.includes('shandilyaacademy')
) {
  key = 'hRyGs9HnimqatBH1PRHc';
} else {
  key = 'gouud4ANiuGZf2TRV8jO';
}

const FileView = (props) => {
  const { history } = props;
  console.log(window.location.origin);
  const viewer = useRef(null);

  useEffect(() => {
    let url;
    if (history.location.state) {
      const { type, filePath } = history.location.state;
      //  setFileType(type);
      url = filePath;
      console.log(filePath, 'state');
    } else {
      const params = getParams(window.location.href);
      //    setFileType(params.fileType);
      url = params.filePath;
    }

    WebViewer(
      {
        path: './public',
        licenseKey: key,
        initialDoc: `${url}`,
      },
      viewer.current,
    ).then((instance) => {
      // now you can access APIs through the WebViewer instance
      const { Core } = instance;

      // adding an event listener for when a document is loaded
      Core.documentViewer.addEventListener('documentLoaded', () => {
        console.log('document loaded');
      });

      // adding an event listener for when the page number has changed
      Core.documentViewer.addEventListener('pageNumberUpdated', (pageNumber) => {
        console.log(`Page number is: ${pageNumber}`);
      });
    });
  }, []);

  return (
    <div style={{ height: '100vh' }}>
      {/* <p style={{ width: "90%" }}>File is : {url}</p> */}
      <div style={{ height: '100vh' }} className='webviewer' ref={viewer}>
        {' '}
      </div>
    </div>
  );
};

export default FileView;

FileView.propTypes = {
  history: PropTypes.instanceOf(Object).isRequired,
};
