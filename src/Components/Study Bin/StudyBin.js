import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import folder from '../../assets/images/FilesFolders/folderIcon.svg';
import doc from '../../assets/images/FilesFolders/doc.svg';
import docx from '../../assets/images/FilesFolders/docx.svg';
import pdf from '../../assets/images/FilesFolders/pdf.svg';
import ppt from '../../assets/images/FilesFolders/ppt.svg';
import xls from '../../assets/images/FilesFolders/xls.svg';
import txt from '../../assets/images/FilesFolders/txt.svg';
import { get, apiValidation } from '../../Utilities';
import { getClientId, getClientUserId } from '../../redux/reducers/clientUserId.reducer';
import { PageHeader, VideoPlayer } from '../Common';
import './StudyBin.scss';

const StudyBin = (props) => {
  const { clientUserId, clientId } = props;
  const [fileArray, setFileArray] = useState([]);
  const [folderArray, setFolderArray] = useState([]);

  const searchFolder = (search) => {
    console.log(search);
  };

  useEffect(() => {
    const payload = {
      client_user_id: clientUserId,
      clientId,
    };

    get(payload, '/getFoldersAndFilesForStudent')
      .then((res) => {
        const result = apiValidation(res);
        setFileArray(result.files);
        setFolderArray(result.folders);
        console.log(res);
      })
      .catch((err) => console.log(err));
  }, [clientId, clientUserId]);

  return (
    <div className='StudyBin'>
      <PageHeader
        title='Study Bin'
        search
        placeholder='Search for file or folder'
        searchFilter={searchFolder}
      />
      <div style={{ marginTop: '6rem' }} className='mx-4 mx-md-5'>
        <h6 className='StudyBin__heading'>
          Folders <span>({folderArray.length})</span>
        </h6>
        <Row>
          {folderArray.map((elem) => {
            return (
              <Col
                xs={{ span: 5, offset: 1 }}
                md={4}
                lg={3}
                key={elem.folder_id}
                className='p-2 StudyBin__box my-2'
              >
                <span className='Dashboard__verticalDots'>
                  <MoreVertIcon />
                </span>
                <div className='m-2 text-center'>
                  <img src={folder} alt='folder' height='67' width='86' />
                  <h6 className='text-center mt-3 StudyBin__folderName'>{elem.folder_name}</h6>
                </div>
              </Col>
            );
          })}
        </Row>
      </div>

      <div className='mx-4 mx-md-5 my-5'>
        <h6 className='StudyBin__heading'>
          Files <span>({fileArray.length})</span>
        </h6>
        <Row>
          {fileArray.map((elem) => {
            return (
              <Col
                xs={{ span: 5, offset: 1 }}
                md={4}
                lg={3}
                key={elem.file_id}
                className='p-2 StudyBin__box my-2'
              >
                {elem.file_type === 'youtube' ? (
                  <VideoPlayer link={elem.file_link} />
                ) : (
                  <>
                    <span className='Dashboard__verticalDots'>
                      <MoreVertIcon />
                    </span>
                    <div className='m-2 text-center'>
                      <a href={elem.file_link}>
                        <img
                          src={
                            elem.file_type === '.doc'
                              ? doc
                              : elem.file_type === '.docx'
                              ? docx
                              : elem.file_type === '.pdf'
                              ? pdf
                              : elem.file_type === '.ppt' || elem.file_type === '.pptx'
                              ? ppt
                              : elem.file_type === '.csv' ||
                                elem.file_type === '.xls' ||
                                elem.file_type === '.xlsx'
                              ? xls
                              : txt
                          }
                          alt='folder'
                          height='67'
                          width='86'
                        />
                        <h6 className='text-center mt-3 StudyBin__folderName'>{elem.file_name}</h6>
                      </a>
                    </div>
                  </>
                )}
              </Col>
            );
          })}
        </Row>
      </div>
      <div style={{ height: '500px' }}>
        <VideoPlayer link='qxmVVa-9xls' />
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  clientId: getClientId(state),
  clientUserId: getClientUserId(state),
});

export default connect(mapStateToProps)(StudyBin);
