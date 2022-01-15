import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';

import AssignmentIcon from '@material-ui/icons/AssignmentOutlined';
import Card from 'react-bootstrap/Card';
import { Row, Col, Container, Button, Form, Modal } from 'react-bootstrap';
import './OfflineAssignments.scss';
// import AssignmentIcon from '@mui/icons-material/Assignment';

const AssignmentCards = (props) => {
  const {
    testName,
    firstName,
    lastName,
    createdAt,
    testDetails,
    totalMarks,
    batchArray,
    testId,
    subjectMarks,
    marks,
  } = props;

  // const goToDashboard = (e) => {
  //   history.push('/offlineassignments/studentmarks');

  return (
    <div className='cardBody mx-auto'>
      <Card className='d-flex flex-column cardContainer'>
        <div className='d-flex flex-row p-3 justify-content-between'>
          <Card.Body className='body1'>
            <Card.Title className='cardTitle'>
              <AssignmentIcon style={{ marginRight: '10px' }} />
              {testName}
            </Card.Title>

            <Card.Subtitle className='mb-2 text-muted cardSubtitle'>
              {new Intl.DateTimeFormat('en-GB', {
                year: 'numeric',
                month: 'long',
                day: '2-digit',
              }).format(createdAt * 1000)}
            </Card.Subtitle>
            <Card.Subtitle className='mb-2 text-muted createdByTextOFA'>
              Created by: {firstName + lastName}
            </Card.Subtitle>
            {batchArray.length > 0 && (
              <Card.Subtitle
                className='my-3 batchesOFA d-flex'
                style={{ fontFamily: 'Montserrat-SemiBold' }}
              >
                To:{' '}
                {batchArray.length > 0 &&
                  batchArray.map((i) => {
                    return <div className='batchesOFA ml-1'>{i} </div>;
                  })}
              </Card.Subtitle>
            )}

            {testDetails && (
              <>
                <Card.Subtitle
                  className='batchesOFA mt-3'
                  style={{ fontFamily: 'Montserrat-medium' }}
                >
                  Description
                </Card.Subtitle>
                <Card.Text className='batchesOFA'>{testDetails}</Card.Text>
              </>
            )}
          </Card.Body>
          <Card.Body className='text-center'>
            <Card.Title className='totalMarksTextOFA mb-0'>Total marks</Card.Title>

            <Card.Title>
              {marks ? (
                <span className='marks small'>{`${marks}/${totalMarks}`}</span>
              ) : (
                <span className='marks'>{totalMarks}</span>
              )}
            </Card.Title>
          </Card.Body>
        </div>
        {subjectMarks && (
          <div className='w-100 px-3'>
            {subjectMarks?.map((e) => {
              return (
                <div className='SubjectMarksContainer m-0'>
                  <p className='subjectName mb-0'>{e.subject_name}</p>
                  <p className='subjectMarks mb-1'>{`${e.subject_marks}/${e.subject_total_marks}`}</p>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
};
AssignmentCards.propTypes = {
  testName: PropTypes.string.isRequired,
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  testDetails: PropTypes.string.isRequired,
  totalMarks: PropTypes.string.isRequired,
  batchArray: PropTypes.instanceOf(Array).isRequired,
  testId: PropTypes.number.isRequired,
  subjectMarks: PropTypes.instanceOf(Array),
  marks: PropTypes.string,
};

AssignmentCards.defaultProps = {
  subjectMarks: null,
  marks: null,
};

export default AssignmentCards;
