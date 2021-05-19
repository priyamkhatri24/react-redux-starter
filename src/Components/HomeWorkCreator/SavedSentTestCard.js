import React from 'react';
import PropTypes from 'prop-types';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import AssignmentOutlinedIcon from '@material-ui/icons/AssignmentOutlined';
import fromUnixTime from 'date-fns/fromUnixTime';
import format from 'date-fns/format';
import '../Live Classes/LiveClasses.scss';

const SavedSentCard = (props) => {
  const { elem, testsType } = props;
  return (
    <Row className='LiveClasses__adminCard p-2 m-3' key={`elem${elem.test_id}`}>
      <Col xs={2}>
        <AssignmentOutlinedIcon />
      </Col>
      <Col xs={10} className='p-0'>
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
            {elem.batch_array.map((e, i) => (
              <span key={i}>{e}, </span> // eslint-disable-line
            ))}
          </p>
        )}
      </Col>
    </Row>
  );
};

export default SavedSentCard;

SavedSentCard.propTypes = {
  elem: PropTypes.instanceOf(Object).isRequired,
  testsType: PropTypes.string.isRequired,
};
