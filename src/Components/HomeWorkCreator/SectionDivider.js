/** @jsxImportSource @emotion/react */

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Swal from 'sweetalert2';
import RangeSlider from 'react-bootstrap-range-slider';
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';
import AdmissionStyle from '../Admissions/Admissions.style';
import '../Common/ScrollableCards/ScrollableCards.scss';

const SectionDivider = (props) => {
  const {
    setActiveSection,
    noOfSections,
    setNoOfSections,
    customSectionArray,
    setCustomSectionArray,
    totalQuestions,
    getSectionDetails,
    sectionQuestionDetails,
  } = props;
  const [sections, setSections] = useState([
    { id: 1, name: 'No Sections', isActive: true },
    { id: 2, name: 'Subject Wise', isActive: false },
    { id: 3, name: 'Create Your Own', isActive: false },
  ]);

  const [currentCustomSectionArray, setCurrentCustomSectionArray] = useState([]);

  useEffect(() => {
    setCurrentCustomSectionArray(customSectionArray);
  }, [customSectionArray]);

  const changeActiveSection = (id) => {
    const newSections = sections.map((e) => {
      if (e.id === id) {
        e.isActive = true;
        setActiveSection(e.name);
      } else e.isActive = false;
      return e;
    });
    if (id === 3) getSectionDetails();
    setSections(newSections);
  };

  const changeSectionName = (id, value, type) => {
    const currSum = customSectionArray.reduce((acc, curr) => {
      return acc + (curr.id === id ? 0 : curr.noOfQuestions ? parseInt(curr.noOfQuestions, 10) : 0);
    }, 0);
    if (currSum + parseInt(value, 10) > totalQuestions) {
      Swal.fire({
        icon: 'error',
        title: 'Total No of Questions Exceeded!',
        text: `Total No of questions across sections must be less than ${totalQuestions}`,
      });
    } else {
      const updatedSections = customSectionArray.map((e) => {
        if (e.id === id) e[type] = value;
        return e;
      });

      setCustomSectionArray(updatedSections);
    }
  };

  return (
    <Card className='mx-1 my-3'>
      <p className='Scrollable__recentlyUsed m-2'>Divide Paper Into Sections</p>
      <Row className='m-3'>
        <section css={AdmissionStyle.scrollable}>
          {sections.map((e) => {
            return (
              <div
                key={e.id} //eslint-disable-line
                css={AdmissionStyle.subjectBubble}
                onClick={() => changeActiveSection(e.id)}
                onKeyDown={() => changeActiveSection(e.id)}
                role='button'
                tabIndex='-1'
                style={
                  e.isActive
                    ? {
                        color: '#fff',
                        backgroundColor: 'rgba(127, 196, 253, 1)',
                        minWidth: '130px',
                      }
                    : {
                        color: 'rgba(127, 196, 253, 1)',
                        border: '1px solid rgba(127, 196, 253, 1)',
                        minWidth: '130px',
                      }
                }
              >
                {e.name}
              </div>
            );
          })}
        </section>
      </Row>
      {sections[1].isActive && (
        <>
          <Row className='mx-0 my-2'>
            <Col
              xs={6}
              className='text-center Homework__markingPrompt'
              style={{ color: 'rgba(38, 153, 251, 1)' }}
            >
              Subjects
            </Col>
            <Col
              xs={6}
              className='text-center Homework__markingPrompt'
              style={{ color: 'rgba(38, 153, 251, 1)' }}
            >
              No of Questions
            </Col>
          </Row>
          {sectionQuestionDetails.length > 0 &&
            sectionQuestionDetails.map((e) => {
              return (
                <Row key={e.question_id} className='mx-0 my-2'>
                  <Col xs={6} className='text-center Homework__markingPrompt'>
                    {e.name}
                  </Col>
                  <Col xs={6} className='text-center Homework__markingPrompt'>
                    {e.questions.length}
                  </Col>
                </Row>
              );
            })}
        </>
      )}

      {sections[2].isActive && (
        <>
          <p
            className='Scrollable__feecardHeading m-2 text-center'
            style={{ fontFamily: 'Montserrat-Regular' }}
          >
            Select number of sections
          </p>
          <div className='m-2 px-4'>
            <RangeSlider
              max={6}
              min={1}
              value={noOfSections}
              onChange={(e) => setNoOfSections(parseInt(e.target.value, 10))}
              tooltip='on'
            />
          </div>
          {currentCustomSectionArray.map((elem) => {
            return (
              <Row key={elem.id}>
                <Col xs={6}>
                  <label className='has-float-label my-3 mx-1 '>
                    <input
                      className='form-control'
                      name='Section Name'
                      type='text'
                      placeholder='Section Name'
                      value={elem.name}
                      onChange={(e) => changeSectionName(elem.id, e.target.value, 'name')}
                    />
                    <span>Section Name</span>
                  </label>
                </Col>
                <Col xs={6}>
                  <label className='has-float-label my-3 mx-1 '>
                    <input
                      className='form-control'
                      name='No of questions'
                      type='number'
                      placeholder='No of questions'
                      value={elem.noOfQuestions}
                      onChange={(e) => changeSectionName(elem.id, e.target.value, 'noOfQuestions')}
                    />
                    <span>No of questions</span>
                  </label>
                </Col>
              </Row>
            );
          })}
        </>
      )}
      {sections[2].isActive && (
        <Row className='mx-auto my-3'>
          <Button variant='customPrimary' onClick={() => getSectionDetails()}>
            Done
          </Button>
        </Row>
      )}
    </Card>
  );
};

export default SectionDivider;

SectionDivider.propTypes = {
  setActiveSection: PropTypes.func.isRequired,
  noOfSections: PropTypes.number.isRequired,
  setNoOfSections: PropTypes.func.isRequired,
  customSectionArray: PropTypes.instanceOf(Array).isRequired,
  setCustomSectionArray: PropTypes.func.isRequired,
  totalQuestions: PropTypes.number.isRequired,
  getSectionDetails: PropTypes.func.isRequired,
  sectionQuestionDetails: PropTypes.instanceOf(Array).isRequired,
};
