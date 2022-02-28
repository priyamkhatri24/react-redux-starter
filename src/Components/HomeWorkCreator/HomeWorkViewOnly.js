import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ReactToPrint from 'react-to-print';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import {
  getHomeworkLanguageType,
  getHomeworkQuestionArray,
  getTestIsDraft,
  getTestName,
} from '../../redux/reducers/homeworkCreator.reducer';
import FinalQuestionCard from './FinalQuestionCard';
import { PageHeader } from '../Common';
import './HomeWorkCreator.scss';
import { homeworkActions } from '../../redux/actions/homework.action';

const HomeWorkViewOnly = (props) => {
  const {
    testName,
    testIsDraft,
    questionArray,
    history,
    history: {
      location: {
        state: { draft, onlyNext, testsType, testIdd, courseId, sectionId, noButton },
      },
    },
    setCurrentSlide,
    setSelectedQuestionArrayToStore,
    homeworkLanguageType,
  } = props;

  const componentRef = useRef();
  const [showMarkingModal, setShowMarkingModal] = useState(false);

  const modifyQuestions = () => {
    setShowMarkingModal(false);
    if (testsType === 'saved') {
      setSelectedQuestionArrayToStore(questionArray);
      questionArray.forEach((ele) => {
        ele.directFromSaved = true;
        ele.isSelected = true;
      });
      setCurrentSlide(2);
      history.push('/homework');
      return;
    }
    setSelectedQuestionArrayToStore([]);
    setCurrentSlide(1);
    history.push('/homework');
  };

  const goToAssigner = () => {
    setSelectedQuestionArrayToStore(questionArray);
    history.push({
      pathname: '/homework/assign',
      state: { draft, onlyNext, testIdd, courseId, sectionId },
    });
    setShowMarkingModal(false);
  };
  return (
    <>
      <PageHeader title={testName} shadow />
      <Card
        style={{ marginTop: '4rem' }}
        className='Homework__selectCard mb-3 mx-2'
        ref={componentRef}
      >
        {questionArray.map((question, index) => {
          return (
            <FinalQuestionCard
              question={question}
              index={index}
              // eslint-disable-next-line
              key={index}
              isViewOnly
              language={homeworkLanguageType}
            />
          );
        })}
      </Card>
      <div className='viewOnlyBtnContainer m-auto'>
        {!noButton && (
          <Button variant='customPrimary' onClick={() => setShowMarkingModal(true)}>
            Next
          </Button>
        )}

        {!onlyNext && !noButton ? (
          <Button variant='customPrimary ml-3' onClick={() => modifyQuestions()}>
            Add/Remove
          </Button>
        ) : null}

        <ReactToPrint
          content={() => componentRef.current}
          trigger={() => (
            <Button variant='customPrimary' style={{ marginLeft: '10px' }}>
              Download
            </Button>
          )}
        />
      </div>

      <Modal show={showMarkingModal} centered onHide={() => setShowMarkingModal(false)}>
        <Modal.Header closeButton>
          <span style={{ fontFamily: 'Montserrat-Bold' }}>Edit the marking scheme</span>
        </Modal.Header>
        <Modal.Body>
          <div className='Homework__modalDiv'>
            <button type='button' className='Homework__modalButton' onClick={() => goToAssigner()}>
              Continue with existing marking scheme
            </button>
          </div>
          <div className='Homework__modalDiv'>
            <button
              type='button'
              className='Homework__modalButton'
              onClick={() => modifyQuestions()}
            >
              Edit the marking scheme
            </button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

const mapStateToProps = (state) => ({
  testName: getTestName(state),
  testIsDraft: getTestIsDraft(state),
  questionArray: getHomeworkQuestionArray(state),
  homeworkLanguageType: getHomeworkLanguageType(state),
});

const mapDispatchToProps = (dispatch) => {
  return {
    setCurrentSlide: (payload) => {
      dispatch(homeworkActions.setCurrentSlide(payload));
    },
    setSelectedQuestionArrayToStore: (payload) => {
      dispatch(homeworkActions.setSelectedQuestionArrayToStore(payload));
    },
    setHomeworkLanguageTypeToStore: (payload) => {
      dispatch(homeworkActions.setHomeworkLanguageTypeToStore(payload));
    },
    clearTests: () => {
      dispatch(homeworkActions.clearTests());
    },
    setCurrentChapterArrayToStore: (payload) => {
      dispatch(homeworkActions.setCurrentChapterArrayToStore(payload));
    },
    setCurrentSubjectArrayToStore: (payload) => {
      dispatch(homeworkActions.setCurrentSubjectArrayToStore(payload));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeWorkViewOnly);

HomeWorkViewOnly.propTypes = {
  history: PropTypes.instanceOf(Object).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
    location: PropTypes.shape({
      state: PropTypes.shape({
        onlyNext: PropTypes.bool,
        noButton: PropTypes.bool,
        testsType: PropTypes.string,
        draft: PropTypes.bool,
        testIdd: PropTypes.number,
        courseId: PropTypes.number,
        sectionId: PropTypes.number,
      }),
    }),
  }).isRequired,
  testName: PropTypes.string.isRequired,
  homeworkLanguageType: PropTypes.string.isRequired,
  testIsDraft: PropTypes.number.isRequired,
  questionArray: PropTypes.instanceOf(Array).isRequired,
  setCurrentSlide: PropTypes.func.isRequired,
  setSelectedQuestionArrayToStore: PropTypes.func.isRequired,
};
