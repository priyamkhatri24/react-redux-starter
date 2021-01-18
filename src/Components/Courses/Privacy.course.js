import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Card from 'react-bootstrap/Card';
import CreateIcon from '@material-ui/icons/Create';
import Row from 'react-bootstrap/Row';
import { courseActions } from '../../redux/actions/course.action';

const Privacy = (props) => {
  const { setCourseCurrentSlideToStore } = props;

  return (
    <div>
      {[
        'Basic Information',
        'Create your content',
        'Course display page',
        'Pricing and promotion',
      ].map((e, i) => {
        return (
          <Card
            className='m-2 p-2'
            style={{ boxShadow: '0px 1px 3px 0px rgba(0,0,0,0.16)', borderRadius: '10px' }}
            onClick={() => setCourseCurrentSlideToStore(i + 1)}
          >
            <Row className='my-auto Courses__createCourse mx-2'>
              <span className='Courses__coloredNumber mr-2'>{i + 1}</span>{' '}
              <span className='my-auto ml-3'>{e}</span>
              <span className='ml-auto' style={{ color: 'rgba(0, 0, 0, 0.54)' }}>
                <CreateIcon />
              </span>
            </Row>
          </Card>
        );
      })}
      <Card
        className='m-2 p-2'
        style={{ boxShadow: '0px 1px 3px 0px rgba(0,0,0,0.16)', borderRadius: '10px' }}
      >
        <Row className='my-auto Courses__createCourse mx-2'>
          <span className='Courses__coloredNumber mr-2'>5</span>{' '}
          <span className='my-auto ml-3'>Privacy and publish</span>
        </Row>
        Karenge ab publish
      </Card>
    </div>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    setCourseCurrentSlideToStore: (payload) => {
      dispatch(courseActions.setCourseCurrentSlideToStore(payload));
    },
  };
};

export default connect(null, mapDispatchToProps)(Privacy);

Privacy.propTypes = {
  setCourseCurrentSlideToStore: PropTypes.func.isRequired,
};
