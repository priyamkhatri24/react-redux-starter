import React, { useEffect, useState } from 'react';
import FileViewer from 'react-file-viewer';
import { getParams } from '../../../Utilities';

export const FileView = (props) => {
  const [fileType, setFileType] = useState('');
  const [fileViewPath, setFilePath] = useState('');

  useEffect(() => {
    if (props.location.state) {
      const { type, filePath } = props.location.state;
      setFileType(type);
      setFilePath(filePath);
    } else {
      const params = getParams(window.location.href);
      setFileType(params.fileType);
      setFilePath(params.filePath);
    }
  }, [props.location.state]);

  return (
    <div style={{ height: '100vh' }}>
      <FileViewer fileType={fileType} filePath={fileViewPath} onError={(e) => console.error(e)} />
    </div>
  );
};
