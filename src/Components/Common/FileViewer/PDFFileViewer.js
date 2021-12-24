import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import WebViewer from '@pdftron/pdfjs-express-viewer';
import { getParams } from '../../../Utilities';

const FileView = (props) => {
  const { history } = props;
  const viewer = useRef(null);
  //   const [url, setUrl] = useState('');
  //   useEffect(() => {
  //     if (history.location.state) {
  //       const { type, filePath } = history.location.state;
  //       //  setFileType(type);
  //       setUrl(filePath);
  //       console.log(filePath, 'state');
  //     } else {
  //       const params = getParams(window.location.href);
  //       //    setFileType(params.fileType);
  //       setUrl(params.filePath);
  //     }
  //   }, [history.location.state]);

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
        licenseKey: `${
          process.env.NODE_ENV === 'development' ? 'q1oxn6WyDRc572siUU5z' : 'gouud4ANiuGZf2TRV8jO'
        }`,
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
