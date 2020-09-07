import React from 'react';
import Row from 'react-bootstrap/Row';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import './AdmissionChat.scss';
import Enquiry from './Enquiry/Enquiry';
import avatarImage from '../../../assets/images/avatarImage.jpg';
import { BackButton } from '../../Common';

const AdmissionChat = () => {
  return (
    <div className='Admission'>
      <Row className='Admission__nav m-0 px-4 pt-3 '>
        <div className='mt-2 mx-2 mx-lg-4'>
          <BackButton color='FFF' />
        </div>
        <div className='m-1 '>
          <img
            src={avatarImage}
            alt='avatar'
            height='38'
            width='38'
            className='Admission__avatar'
          />
        </div>
        <div className='p-0'>
          <p className='Admission__avatarHeading mb-0 mt-2 ml-2'>Akash Gupta</p>
          <p className='Admission__avatarStatus'>
            <FiberManualRecordIcon className='Admission__onlineIcon' />
            Online
          </p>
        </div>

        <div className='Admission__overlay'>
          <Enquiry />
        </div>
      </Row>
    </div>
  );
};

export default AdmissionChat;
