/* eslint-disable */

import React, { useEffect, useState } from 'react';
import { pdfjs, Document, Page } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import Button from 'react-bootstrap/Button';
import { getParams } from '../../../Utilities';
import { PageHeader } from '../PageHeader/PageHeader';
import Row from 'react-bootstrap/Row';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const FileView = (props) => {
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

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    console.log(numPages);
  };

  return (
    <>
      <PageHeader title='File Viewer' />
      <div style={{ width: '100%', overflow: 'scroll', marginTop: '5rem' }}>
        {/* <FileViewer fileType={fileType} filePath={fileViewPath} onError={(e) => console.error(e)} /> */}
        <Document file={fileViewPath} onLoadSuccess={onDocumentLoadSuccess}>
          <Page pageNumber={pageNumber} width={width} />
        </Document>
      </div>
      <Row className='mx-5 my-3 justify-content-between'>
        <Button
          variant='customPrimarySmol'
          onClick={() => setPageNumber((p) => (p > 1 ? p - 1 : p))}
        >
          Previous
        </Button>
        <Button
          variant='customPrimarySmol'
          onClick={() => setPageNumber((p) => (p > numPages - 1 ? p : p + 1))}
          style={pageNumber === numPages ? { display: 'none' } : {}}
        >
          Next Page
        </Button>
      </Row>
    </>
  );
};

export default FileView;
