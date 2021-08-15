/* eslint-disable */

import React, { useEffect, useState, useRef } from 'react';
import { pdfjs, Document, Page } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import Button from 'react-bootstrap/Button';
import { getParams } from '../../../Utilities';
import { Slider } from '@material-ui/core';
import { PageHeader } from '../PageHeader/PageHeader';
import Row from 'react-bootstrap/Row';
import './PDFViewer.css';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const FileView = (props) => {
  // const [fileType, setFileType] = useState('');
  const [fileViewPath, setFilePath] = useState('');
  const [scale, setScale] = useState(1);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const width = window.innerWidth;
  const sliderRef = useRef(null);
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
    sliderRef.current.style.width = '60%';
    sliderRef.current.style.margin = 'auto';
  }, [props.location.state, sliderRef]);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    console.log(numPages);
  };

  const sliderClasses = {
    height: '10%',
    display: 'flex',
    alignItems: 'center',
    margin: 'auto',
    width: '60%',
    color: 'red',
  };

  return (
    <>
      <PageHeader title='File Viewer' />
      <div style={{ width: '100%', overflow: 'scroll', marginTop: '5rem' }}>
        {/* <FileViewer fileType={fileType} filePath={fileViewPath} onError={(e) => console.error(e)} /> */}
        <Document file={fileViewPath} onLoadSuccess={onDocumentLoadSuccess}>
          <Page pageNumber={pageNumber} width={width} height='100%' scale={scale} />
        </Document>
      </div>
      <div ref={sliderRef} className='sliderClassesForZoom'>
        <Slider
          min={1}
          max={3}
          step={0.1}
          value={scale}
          onChange={(e, scale) => {
            setScale(scale);
            window.scrollTo(0, document.body.scrollHeight);
          }}
        />
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
