/** @jsxImportSource @emotion/react */
import React from 'react';
import PropTypes from 'prop-types';
import Col from 'react-bootstrap/Col';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import avatarImage from '../../assets/images/user.svg';
import AdmissionStyle from './Admissions.style';

const BatchesDataCard = (props) => {
  const { elem, history } = props;
  console.log(elem, 'elemmmmmmm', 'agcth');
  return (
    <Col
      xs={5}
      key={elem.client_batch_id}
      css={AdmissionStyle.box}
      style={
        elem.batch_status === 'inactive'
          ? { backgroundColor: 'rgba(238,238,238,0.8)', border: 'transparent' }
          : {}
      }
      className='p-2 my-2 mx-2'
      onClick={() => {
        history.push({ pathname: '/admissions/batch', state: { batch: elem } });
      }}
    >
      <>
        <span css={AdmissionStyle.verticalDots}>
          <MoreVertIcon />
        </span>
        <div className='m-2 text-center' style={{ paddingTop: '10px' }}>
          <img src={avatarImage} alt='batchpic' css={AdmissionStyle.batchImg} />
          <h6
            css={AdmissionStyle.batchName}
            className={`text-center mt-3 ${elem.batch_status === 'inactive' ? 'mb-0' : ''}`}
          >
            {elem.batch_name}
          </h6>
          {elem.batch_status === 'inactive' ? (
            <p className='mb-0' css={AdmissionStyle.students}>
              (inactive)
            </p>
          ) : null}
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
