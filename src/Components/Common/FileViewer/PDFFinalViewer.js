import React from 'react';
import PDFFileViewer from './PDFFileViewer';
import PDFFileViewerOld from './PDFFileViewerOld';
import './PDFViewer.css';

const PDFFinalViewer = () => {
  return (
    <>
      <React.Fragment className='desktoppdf'>
        <PDFFileViewer />
      </React.Fragment>
      {/* <React.Fragment className='mobilepdf'>
        <PDFFileViewerOld />
      </React.Fragment> */}
    </>
  );
};

export default PDFFinalViewer;
