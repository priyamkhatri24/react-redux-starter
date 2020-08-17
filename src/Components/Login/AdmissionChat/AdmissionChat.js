import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import './AdmissionChat.scss';
import Enquiry from './Enquiry/Enquiry';
import avatarImage from '../../../assets/images/avatarImage.jpg';

const AdmissionChat = () => {
  return (
    <div className='Admission'>
      <Row className='Admission__nav m-0 px-5 pt-3 '>
        <Col xs={3}>
          <img
            src={avatarImage}
            alt='avatar'
            height='50'
            width='50'
            className='Admission__avatar'
          />
        </Col>
        <Col xs={9} className='p-0'>
          <p className='Admission__avatarHeading mb-0 mt-2 ml-2'>Akash Gupta</p>
          <p className='Admission__avatarStatus'>
            <FiberManualRecordIcon className='Admission__onlineIcon' />
            Online
          </p>
        </Col>
        <div className='Admission__overlay'>
          <Enquiry />
        </div>
      </Row>
    </div>
  );
};

export default AdmissionChat;
