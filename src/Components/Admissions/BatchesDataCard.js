/** @jsxImportSource @emotion/react */
import { jsx } from '@emotion/react';
import React from 'react';
import PropTypes from 'prop-types';
import Col from 'react-bootstrap/Col';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import avatarImage from '../../assets/images/user.svg';
import AdmissionStyle from './Admissions.style';

const BatchesDataCard = (props) => {
  const { elem, history } = props;
  return (
    <Col
      xs={5}
      key={elem.client_batch_id}
      css={AdmissionStyle.box}
      className='p-2 my-2 mx-2'
      onClick={() => {
        history.push({ pathname: '/admissions/batch', state: { batch: elem } });
      }}
    >
      <>
        <span css={AdmissionStyle.verticalDots}>
          <MoreVertIcon />
        </span>
        <div className='m-2 text-center'>
          <img src={avatarImage} alt='batchpic' height='40' width='40' />
          <h6 css={AdmissionStyle.batchName} className='text-center mt-3 '>
            {elem.batch_name}
          </h6>
          <p css={AdmissionStyle.batchStudents} className='mb-0'>
            {elem.number_of_students}
          </p>
          <p css={AdmissionStyle.students}>students</p>
        </div>
      </>
    </Col>
  );
};

export default BatchesDataCard;

BatchesDataCard.propTypes = {
  elem: PropTypes.instanceOf(Object).isRequired,
  history: PropTypes.instanceOf(Object).isRequired,
};
