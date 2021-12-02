/** @jsxImportSource @emotion/react */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import AdmissionStyle from '../Admissions/Admissions.style';
import '../Common/ScrollableCards/ScrollableCards.scss';

const MarkingSchemeDecider = (props) => {
  const {
    setIsIndividualMarks,
    marks,
    setMarks,
    showSectionWise,
    sectionMarks,
    updateSectionMarks,
  } = props;
  const [sections, setSections] = useState([
    { id: 1, name: 'Full Paper', isActive: true },
    { id: 2, name: 'Section Wise', isActive: false },
    { id: 3, name: 'Question Wise', isActive: false },
  ]);

  const changeActiveSection = (id) => {
    const newSections = sections.map((e) => {
      if (e.id === id) {
        e.isActive = true;
        //    setActiveSection(e.name);
      } else e.isActive = false;
      return e;
    });

    if (id === 3) setIsIndividualMarks(true);
    else setIsIndividualMarks(false);
    setSections(newSections);
  };

  const updateMarks = (id, value) => {
    const reqMarks = marks.map((e) => {
      if (e.id === id) e.value = value;
      return e;
    });
    setMarks(reqMarks);
  };

  return (
    <Card className='mx-1 my-3'>
      <p className='Scrollable__recentlyUsed m-2'>Marking Scheme</p>
      <Row className='m-3'>
        <section css={AdmissionStyle.scrollable}>
          {sections
            .filter((e) => {
              if (!showSectionWise) return e.id !== 2;
              return e;
            })
            .map((e) => {
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
      {sections[0].isActive && (
        <p className='Homework__markingPrompt ml-3 mb-1'>Marks offered for every question :</p>
      )}
      {sections[0].isActive ? (
        <Row className='mx-0'>
          {marks.map((elem) => {
            return (
              <Col xs={4} className='text-center' key={elem.id}>
                <label
                  className='has-float-label my-3 mx-1 '
                  style={{ fontSize: '10px', color: elem.color }}
                >
                  <input
                    className='form-control'
                    name={elem.name}
                    type='number'
                    placeholder={elem.name}
                    value={elem.value}
                    onChange={(e) => updateMarks(elem.id, e.target.value)}
                    style={{ borderColor: elem.color }}
                  />
                  <span style={{ color: elem.color }}>{elem.name}</span>
                </label>
              </Col>
            );
          })}
        </Row>
      ) : sections[1].isActive ? (
        <>
          {sectionMarks.map((element, i) => {
            return (
              // eslint-disable-next-line
              <div key={i}>
                <p className='Homework__markingHeading ml-3 mb-1'>{element.sectionName}:</p>
                <p className='Homework__markingPrompt ml-3 mb-1'>
                  Marks offered for every question :
                </p>
                <Row className='mx-0'>
                  {element.marksArray.map((elem) => {
                    return (
                      <Col xs={4} className='text-center'>
                        <label
                          className='has-float-label my-3 mx-1 '
                          style={{ fontSize: '10px', color: elem.color }}
                        >
                          <input
                            className='form-control'
                            name={elem.name}
                            type='number'
                            placeholder={elem.name}
                            value={elem.value}
                            onChange={(e) =>
                              updateSectionMarks(element.sectionName, elem.id, e.target.value)
                            } // eslint-disable-line
                            style={{ borderColor: elem.color }}
                          />
                          <span style={{ color: elem.color }}>{elem.name}</span>
                        </label>
                      </Col>
                    );
                  })}
                </Row>
              </div>
            );
          })}
        </>
      ) : (
        <Row
          className='justify-content-center p-3 m-2'
          style={{ backgroundColor: 'rgba(127, 196, 253, 0.4)' }}
        >
          <span className='Homework__markingPrompt text-center'>
            Visit every question to assign marking scheme
          </span>
        </Row>
      )}
    </Card>
  );
};

export default MarkingSchemeDecider;

MarkingSchemeDecider.propTypes = {
  setIsIndividualMarks: PropTypes.func.isRequired,
  marks: PropTypes.instanceOf(Array).isRequired,
  setMarks: PropTypes.func.isRequired,
  showSectionWise: PropTypes.bool.isRequired,
  sectionMarks: PropTypes.instanceOf(Array).isRequired,
  updateSectionMarks: PropTypes.func.isRequired,
};
