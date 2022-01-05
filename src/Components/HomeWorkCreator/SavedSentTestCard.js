import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import AssignmentOutlinedIcon from '@material-ui/icons/AssignmentOutlined';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import fromUnixTime from 'date-fns/fromUnixTime';
import format from 'date-fns/format';
import { post } from '../../Utilities';
import '../Live Classes/LiveClasses.scss';

const SavedSentCard = (props) => {
  const { elem, testsType, updateTests } = props;
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const deleteTestHandler = () => {
    post({ test_id: elem.test_id }, '/deleteTest').then((res) => {
      updateTests();
      console.log(res);
      setShowDeleteModal(false);
    });
  };

  return (
    <>
      <Row className='LiveClasses__adminCard p-2 m-3' key={`elem${elem.test_id}`}>
        <Col xs={2}>
          <AssignmentOutlinedIcon />
        </Col>
        <Col xs={8} className='p-0'>
          <h6 className='LiveClasses__adminHeading mb-0'>{elem.test_name}</h6>
          <p className='LiveClasses__adminCardTime mb-0' style={{ fontSize: '10px' }}>
            Created: {format(fromUnixTime(elem.created_at), 'HH:mm MMM dd, yyyy')}
          </p>
          <p className='Homework__dueDate mb-0'>
            {testsType === 'sent' ? 'Sent' : 'Created'} By: {elem.first_name} {elem.last_name}
          </p>
          {testsType === 'sent' && (
            <p className='Homework__dueDate mb-0'>
              To:{' '}
              {elem.batch_array.slice(0, 15).map((e, i) => (
                <span key={i}>{e}, </span> // eslint-disable-line
              ))}
              {elem.batch_array.length > 15 ? <span>...</span> : null}
            </p>
          )}
        </Col>
        <Col className='moreVertiIconSAVED' style={{ textAlign: 'right' }} xs={1}>
          <MoreVertIcon
            onClick={(e) => {
              e.stopPropagation();
              setShowDeleteModal(true);
            }}
          />
        </Col>
      </Row>
      <Modal show={showDeleteModal} centered onClick={(e) => e.stopPropagation()}>
        <Modal.Body>Are you sure you really want to delete this test</Modal.Body>
        <Modal.Footer>
          <Button
            variant='boldTextSecondary'
            onClick={(e) => {
              e.stopPropagation();
              setShowDeleteModal(false);
            }}
          >
            Cancel
          </Button>

          <Button
            variant='boldText'
            onClick={(e) => {
              e.stopPropagation();
              deleteTestHandler();
            }}
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default SavedSentCard;

SavedSentCard.propTypes = {
  elem: PropTypes.instanceOf(Object).isRequired,
  testsType: PropTypes.string.isRequired,
  updateTests: PropTypes.func.isRequired,
};
