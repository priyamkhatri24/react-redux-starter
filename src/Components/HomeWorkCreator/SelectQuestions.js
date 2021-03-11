import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import CloseIcon from '@material-ui/icons/Close';
import Button from 'react-bootstrap/Button';
import RangeSlider from 'react-bootstrap-range-slider';
import { get, apiValidation } from '../../Utilities';
import { homeworkActions } from '../../redux/actions/homework.action';
import { BatchesSelector } from '../Common';
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';

const SelectQuestions = (props) => {
  const { history, fetch, setCurrentSubjectArrayToStore, setCurrentChapterArrayToStore } = props;
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState({});
  const [chapters, setChapters] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedChapters, setSelectedChapters] = useState([]);
  const [noOfQuestions, setNoOfQuestions] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);

  useEffect(() => {
    get('', '/getClassesForHomeworkCreator').then((res) => {
      const result = apiValidation(res);
      setClasses(result);
    });
  }, []);

  const selectQuestion = (elem) => {
    const subjectArray = elem.subject_array.map((e) => {
      e.isSelected = false;
      return e;
    });
    setSubjects(subjectArray);
    setCurrentQuestion(elem);
  };

  const selectSubject = (elem) => {
    const newSubjectAraay = subjects.map((e) => {
      if (e.class_subject_id === elem.class_subject_id) e.isSelected = !e.isSelected;
      return e;
    });

    const payloadArray = newSubjectAraay
      .filter((e) => {
        return e.isSelected === true;
      })
      .map((e) => {
        return e.subject_id;
      });
    /** *********************Sets subject array to store**************** */
    const selectedSubjectArray = newSubjectAraay
      .filter((e) => {
        return e.isSelected === true;
      })
      .map((e) => {
        return e.class_subject_id;
      });

    setCurrentSubjectArrayToStore(selectedSubjectArray);
    /** ************************************************************* */
    const payload = {
      class_id: currentQuestion.class_id,
      subject_array: JSON.stringify(payloadArray),
    };

    get(payload, '/getChaptersOfClassSubject').then((res) => {
      const result = apiValidation(res);
      const modifiedChapters = result.map((e) => {
        e.client_batch_id = e.chapter_id;
        e.batch_name = e.chapter_name;
        return e;
      });
      setChapters(modifiedChapters);
      setSelectedChapters([]);
    });

    setSubjects(newSubjectAraay);
  };

  const handleClose = () => {
    setShowModal(false);
    const totalNoOfQuestions = selectedChapters
      .map((e) => e.number_of_questions)
      .reduce((acc, curr) => {
        return acc + curr;
      }, 0);
    setTotalQuestions(totalNoOfQuestions);
  };

  const getSelectedBatches = (payload) => {
    setSelectedChapters(payload);

    const chapterArray = payload.map((e) => e.chapter_id);
    /** ************************Set Chapter Array to Store */
    setCurrentChapterArrayToStore(chapterArray);
    /** ************************************************** */
  };

  const fetchQuestions = () => {
    const chapterArray = selectedChapters.map((e) => e.chapter_id);
    const payload = {
      chapter_array: JSON.stringify(chapterArray),
      number_of_questions: noOfQuestions,
    };

    get(payload, '/getQuestionsForChapters').then((res) => {
      const result = apiValidation(res);
      fetch(result);
    });
  };

  const goToSentSaved = () => {
    history.push({
      pathname: '/homework/savedtests',
      state: { classId: currentQuestion.class_id },
    });
  };

  const goToCreateQuestion = () => {
    history.push('/homework/create');
  };

  return (
    <>
      <Card className='mx-4 Homework__selectCard mb-3'>
        <small className='text-left Homework__smallHeading mx-3 my-2'>Course</small>
        <Row className='mx-3'>
          <section className='Homework__scrollable'>
            {Object.keys(currentQuestion).length === 0 &&
              classes.map((e) => {
                return (
                  <div
                    key={e.class_id}
                    className='Homework__questionBubble'
                    onClick={() => selectQuestion(e)}
                    onKeyDown={() => selectQuestion(e)}
                    role='button'
                    tabIndex='-1'
                  >
                    {e.class_name}
                  </div>
                );
              })}

            {Object.keys(currentQuestion).length > 0 && (
              <>
                <div className='Homework__questionBubble'>{currentQuestion.class_name}</div>
                <div
                  className='Homework__questionBubble'
                  onClick={() => setCurrentQuestion({})}
                  onKeyDown={() => setCurrentQuestion({})}
                  role='button'
                  tabIndex='-1'
                >
                  <CloseIcon />
                </div>
              </>
            )}
          </section>
        </Row>
        <hr />
        <small className='text-left Homework__smallHeading mx-3 my-2'>Subject</small>

        <Row className='mx-3'>
          {Object.keys(currentQuestion).length === 0 && (
            <div className='w-100 text-left'>
              <h5 className='Homework__stepPlaceHolder'>Step 2 : Choose Subject</h5>
            </div>
          )}
          {Object.keys(currentQuestion).length > 0 && (
            <section className='Homework__scrollable'>
              {subjects.map((e) => {
                return (
                  <div
                    key={e.class_subject_id}
                    className={
                      e.isSelected
                        ? 'Homework__subjectBubble Homework__selected'
                        : 'Homework__subjectBubble Homework__unselected'
                    }
                    onClick={() => selectSubject(e)}
                    onKeyDown={() => selectSubject(e)}
                    role='button'
                    tabIndex='-1'
                  >
                    {e.subject_name}
                  </div>
                );
              })}
            </section>
          )}
        </Row>

        <hr />
        <small className='text-left Homework__smallHeading mx-3 my-2'>Chapters</small>

        <Row className='mx-3'>
          {chapters.length === 0 && (
            <div className='w-100 text-left'>
              <h5 className='Homework__stepPlaceHolder'>Step 3 : Choose Chapters</h5>
            </div>
          )}
          {chapters.length > 0 && (
            <>
              <div className='Homework__smallHeading  my-auto'>
                {selectedChapters.length > 0
                  ? `${selectedChapters.length} chapter${
                      selectedChapters.length === 1 ? `` : `s`
                    } selected`
                  : 'Click to select chapters'}
              </div>
              <Button
                variant='customPrimarySmol'
                className='ml-auto'
                onClick={() => setShowModal(true)}
              >
                Select Chapter
              </Button>
            </>
          )}
        </Row>

        <hr />
        <small className='text-left Homework__smallHeading mx-3 my-2'>Questions</small>

        <Row className='mx-3 mb-3'>
          {totalQuestions === 0 && (
            <div className='w-100 text-left'>
              <h5 className='Homework__stepPlaceHolder'>Step 4 : Choose Questions</h5>
            </div>
          )}
          {totalQuestions > 0 && (
            <>
              <small className='text-left Homework__smallHeading mx-3 my-2'>Total Questions</small>
              <Form className='mt-3'>
                <Form.Group as={Row}>
                  <Col xs='9'>
                    <RangeSlider
                      max={totalQuestions}
                      min={1}
                      value={noOfQuestions}
                      onChange={(e) => setNoOfQuestions(e.target.value)}
                    />
                  </Col>
                  <Col xs='3'>
                    <Form.Control readOnly value={noOfQuestions} />
                  </Col>
                </Form.Group>
              </Form>
              <Col xs={12} className='text-center mt-3'>
                <p className='Homework__smallHeading' style={{ color: 'var(--primary-blue)' }}>
                  Show Advanced Filters
                </p>
                <Button variant='customPrimary' onClick={() => fetchQuestions()}>
                  Fetch
                </Button>
              </Col>
              <Card className='w-100 mt-4 p-3 mb-3'>
                <p className='Homework__smallHeading text-left'>Other Options:</p>
                <div
                  className='Homework__smallHeading text-left ml-3 mb-1'
                  onClick={() => goToSentSaved()}
                  onKeyDown={() => goToSentSaved()}
                  role='button'
                  tabIndex='-1'
                >
                  Add from saved/sent tests.
                </div>
                <div
                  className='Homework__smallHeading text-left ml-3 mb-1'
                  onClick={() => goToCreateQuestion()}
                  onKeyDown={() => goToCreateQuestion()}
                  role='button'
                  tabIndex='-1'
                >
                  Add Questions Manually.
                </div>
              </Card>
            </>
          )}
        </Row>
      </Card>

      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Select Chapters</Modal.Title>
        </Modal.Header>
        <BatchesSelector
          batches={chapters}
          getSelectedBatches={getSelectedBatches}
          title='Chapters'
          selectBatches={selectedChapters}
        />
        <Modal.Footer>
          <Button variant='dashboardBlueOnWhite' onClick={handleClose}>
            Next
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    setCurrentChapterArrayToStore: (payload) => {
      dispatch(homeworkActions.setCurrentChapterArrayToStore(payload));
    },
    setCurrentSubjectArrayToStore: (payload) => {
      dispatch(homeworkActions.setCurrentSubjectArrayToStore(payload));
    },
  };
};

export default connect(null, mapDispatchToProps)(SelectQuestions);

SelectQuestions.propTypes = {
  setCurrentSubjectArrayToStore: PropTypes.func.isRequired,
  setCurrentChapterArrayToStore: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  fetch: PropTypes.func.isRequired,
};
