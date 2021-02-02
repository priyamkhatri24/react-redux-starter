import React from 'react';
import PropTypes from 'prop-types';
import Col from 'react-bootstrap/Col';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import avatarImage from '../../assets/images/user.svg';

const BatchesDataCard = (props) => {
  const { elem, history } = props;
  return (
    <Col
      xs={5}
      key={elem.client_batch_id}
      className='p-2 StudyBin__box my-2 mx-2'
      onClick={() => {
        history.push({ pathname: '/admissions/batch', state: { batch: elem } });
      }}
    >
      <>
        <span className='Dashboard__verticalDots'>
          <MoreVertIcon />
        </span>
        <div className='m-2 text-center'>
          <img src={avatarImage} alt='batchpic' height='40' width='40' />
          <h6 className='text-center mt-3 Profile__batchName'>{elem.batch_name}</h6>
          <p className='Profile__batchStudents mb-0'>{elem.number_of_students}</p>
          <p className='Profile__students'>students</p>
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
