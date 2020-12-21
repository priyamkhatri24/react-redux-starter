/* eslint-disable */

import React, { useEffect, useState } from 'react';
import { pdfjs, Document, Page } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';

import { getParams } from '../../../Utilities';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export const FileView = (props) => {
  // const [fileType, setFileType] = useState('');
  const [fileViewPath, setFilePath] = useState('');
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const width = window.innerWidth;

  useEffect(() => {
    if (props.location.state) {
      const { type, filePath } = props.location.state;
      //  setFileType(type);
      setFilePath(filePath);
    } else {
      const params = getParams(window.location.href);
      //    setFileType(params.fileType);
      setFilePath(params.filePath);
    }
  }, [props.location.state]);

  const onDocumentLoadSuccess = ({ numpages }) => {
    setNumPages(numpages);
  };

  return (
    <div style={{ width: '100%', overflow: 'scroll' }}>
      {/* <FileViewer fileType={fileType} filePath={fileViewPath} onError={(e) => console.error(e)} /> */}
      <Document file={fileViewPath} onLoadSuccess={onDocumentLoadSuccess}>
        <Page pageNumber={pageNumber} width={width} />
      </Document>
    </div>
  );
};
