import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
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
    setCurrentSlide,
    setSelectedQuestionArrayToStore,
    homeworkLanguageType,
  } = props;

  const modifyQuestions = () => {
    const { testsType } = history.location.state;
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
    history.push('/homework/assign');
  };

  return (
    <>
      <PageHeader title={testName} />
      <Card style={{ marginTop: '4rem' }} className='Homework__selectCard mb-3 mx-2'>
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
      <div className='viewOnlyBtnContainer m-3'>
        <Button variant='customPrimary' onClick={() => goToAssigner()}>
          Next
        </Button>

        <Button variant='customPrimary ml-3' onClick={() => modifyQuestions()}>
          Add/Remove
        </Button>
      </div>
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
  testName: PropTypes.string.isRequired,
  homeworkLanguageType: PropTypes.string.isRequired,
  testIsDraft: PropTypes.number.isRequired,
  questionArray: PropTypes.instanceOf(Array).isRequired,
  setCurrentSlide: PropTypes.func.isRequired,
  setSelectedQuestionArrayToStore: PropTypes.func.isRequired,
};
