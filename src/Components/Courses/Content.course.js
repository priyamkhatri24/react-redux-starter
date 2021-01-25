import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import CreateIcon from '@material-ui/icons/Create';
import DeleteIcon from '@material-ui/icons/Delete';
import Row from 'react-bootstrap/Row';
import { courseActions } from '../../redux/actions/course.action';
import { post } from '../../Utilities';

const Content = (props) => {
  const {
    setCourseCurrentSlideToStore,
    sectionArray,
    getUpdatedSectionArray,
    getSectiontoUpdateInDB,
    setCourseCurrentSectionIdToStore,
    setCourseCurrentSectionNameToStore,
    history,
  } = props;
  const [section, setSectionArray] = useState([]);
  const [isSectionUpdateValid, setIsSectionUpdateValid] = useState(false);
  const [createNewSection, setCreateNewSection] = useState(false);
  const [nayaSection, setNayaSection] = useState('');

  useEffect(() => {
    const newSectionArray = sectionArray.map((e) => {
      return { ...e, isUpdate: false };
    });
    console.log(newSectionArray);
    setSectionArray(newSectionArray);
  }, [sectionArray]);

  const updateSection = (i) => {
    const newSectionArray = section.map((elem) => {
      if (elem.section_id === i) elem.isUpdate = !elem.isUpdate;
      return elem;
    });

    setSectionArray(newSectionArray);
  };

  const deleteSection = (i) => {
    post({ section_id: i }, '/deleteSection').then((res) => {
      if (res.success) {
        const newSectionArray = section.filter((e) => e.section_id !== i);
        getUpdatedSectionArray(newSectionArray);
      }
    });
  };

  const updateSectionName = (value, id) => {
    const newSection = section.map((e) => {
      if (e.section_id === id) e.section_name = value;
      return e;
    });
    setSectionArray(newSection);
  };

  const updateSectionInDb = (id) => {
    const updatingSection = section.filter((e) => e.section_id === id);
    if (updatingSection[0].section_name) {
      setIsSectionUpdateValid(false);
      getSectiontoUpdateInDB(updatingSection[0].section_name, id, section);
    } else setIsSectionUpdateValid(true);
  };

  const addNewSectionToArray = () => {
    if (nayaSection) {
      setIsSectionUpdateValid(false);
      getSectiontoUpdateInDB(nayaSection, '');
      setNayaSection('');
      setCreateNewSection(false);
    } else setIsSectionUpdateValid(true);
  };

  const addNewContent = (id, name) => {
    setCourseCurrentSectionIdToStore(id);
    setCourseCurrentSectionNameToStore(name);
    history.push('/courses/createcourse/addcontent');
  };

  return (
    <div>
      {['Basic Information'].map((e, i) => {
        return (
          <Card
            className='m-2 p-2'
            style={{ boxShadow: '0px 1px 3px 0px rgba(0,0,0,0.16)', borderRadius: '10px' }}
            onClick={() => setCourseCurrentSlideToStore(1)}
            key={e}
          >
            <Row className='my-auto Courses__createCourse mx-2'>
              <span className='Courses__coloredNumber mr-2'>{1}</span>{' '}
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
          <span className='Courses__coloredNumber mr-2'>2</span>{' '}
          <span className='my-auto ml-3'>Create your content</span>
        </Row>
        {section.map((elem, i) => {
          return (
            <div className='LiveClasses__adminCard p-2 m-3' style={{ position: 'relative' }}>
              <div
                className='Courses__edit text-center py-1'
                onClick={() => updateSection(elem.section_id)}
                role='button'
                onKeyDown={() => {
                  updateSection(elem.section_id);
                }}
                tabIndex='-1'
              >
                <CreateIcon />
              </div>
              {section.length > 1 && (
                <div
                  className='Profile__edit text-center py-1'
                  onClick={() => deleteSection(elem.section_id)}
                  role='button'
                  onKeyDown={() => deleteSection(elem.section_id)}
                  tabIndex='-1'
                >
                  <DeleteIcon />
                </div>
              )}
              <h6 className='LiveClasses__adminHeading mb-2 mx-2'>Section {i + 1}</h6>
              {!elem.isUpdate && (
                <p className='mt-2 mx-2 Courses__motiDetail'>{elem.section_name}</p>
              )}
              {elem.isUpdate && (
                <>
                  {' '}
                  <Row className='mx-2 mt-4'>
                    <label className='has-float-label my-auto'>
                      <input
                        className='form-control'
                        name='Enter your answer'
                        type='text'
                        value={elem.section_name}
                        placeholder='Enter your answer'
                        onChange={(e) => updateSectionName(e.target.value, elem.section_id)}
                      />
                      <span>Enter your answer</span>
                    </label>
                  </Row>
                  <Row className='m-2'>
                    <div className='ml-auto'>
                      <Button
                        variant='boldTextSecondary'
                        onClick={() => updateSection(elem.section_id)}
                      >
                        Cancel
                      </Button>
                      <Button variant='boldText' onClick={() => updateSectionInDb(elem.section_id)}>
                        Update
                      </Button>
                    </div>
                  </Row>
                  {isSectionUpdateValid && (
                    <small className='text-danger d-block'>This field is required</small>
                  )}
                </>
              )}
              <Row className='w-50 m-1'>
                <Button
                  variant='boldText'
                  className='p-0'
                  onClick={() => addNewContent(elem.section_id, elem.section_name)}
                >
                  +Add Content
                </Button>
              </Row>
            </div>
          );
        })}
        {!createNewSection && (
          <Row className='w-50 m-2'>
            <Button
              variant='dashboardBlueOnWhite'
              className='p-1 mx-2'
              onClick={() => setCreateNewSection(true)}
            >
              Add Section
            </Button>
          </Row>
        )}

        {createNewSection && (
          <>
            <div className='LiveClasses__adminCard p-2 m-3' style={{ position: 'relative' }}>
              <h6 className='LiveClasses__adminHeading mb-2 mx-2'>Add new Section </h6>

              <Row className='mx-2 mt-4'>
                <label className='has-float-label my-auto'>
                  <input
                    className='form-control'
                    name='Enter your answer'
                    type='text'
                    value={nayaSection}
                    placeholder='Enter your answer'
                    onChange={(e) => setNayaSection(e.target.value)}
                  />
                  <span>Enter your answer</span>
                </label>
              </Row>

              <Row className='m-2'>
                <div className='ml-auto'>
                  <Button variant='boldTextSecondary' onClick={() => setCreateNewSection(false)}>
                    Cancel
                  </Button>
                  <Button variant='boldText' onClick={() => addNewSectionToArray()}>
                    +ADD
                  </Button>
                </div>
              </Row>
              {isSectionUpdateValid && (
                <small className='text-danger d-block'>This field is required</small>
              )}
            </div>
          </>
        )}

        <Row className='w-25 justify-content-end ml-auto m-2'>
          <Button variant='customPrimarySmol' onClick={() => setCourseCurrentSlideToStore(3)}>
            Continue
          </Button>
        </Row>
      </Card>
      {['Course display page', 'Pricing and promotion', 'Privacy and publish'].map((e, i) => {
        return (
          <Card
            className='m-2 p-2'
            style={{ boxShadow: '0px 1px 3px 0px rgba(0,0,0,0.16)', borderRadius: '10px' }}
            key={i} //eslint-disable-line
          >
            <Row className='my-auto Courses__createCourse mx-2'>
              <span className='Courses__coloredNumber mr-2'>{i + 3}</span>{' '}
              <span className='my-auto ml-3'>{e}</span>
              <span className='ml-auto' style={{ color: 'rgba(0, 0, 0, 0.54)' }}>
                <CreateIcon />
              </span>
            </Row>
          </Card>
        );
      })}
    </div>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    setCourseCurrentSlideToStore: (payload) => {
      dispatch(courseActions.setCourseCurrentSlideToStore(payload));
    },
    setCourseCurrentSectionIdToStore: (payload) => {
      dispatch(courseActions.setCourseCurrentSectionIdToStore(payload));
    },
    setCourseCurrentSectionNameToStore: (payload) => {
      dispatch(courseActions.setCourseCurrentSectionNameToStore(payload));
    },
  };
};

export default connect(null, mapDispatchToProps)(Content);

Content.propTypes = {
  sectionArray: PropTypes.instanceOf(Array).isRequired,
  setCourseCurrentSlideToStore: PropTypes.func.isRequired,
  setCourseCurrentSectionNameToStore: PropTypes.func.isRequired,
  setCourseCurrentSectionIdToStore: PropTypes.func.isRequired,
  getUpdatedSectionArray: PropTypes.func.isRequired,
  getSectiontoUpdateInDB: PropTypes.func.isRequired,
  history: PropTypes.instanceOf(Object).isRequired,
};
