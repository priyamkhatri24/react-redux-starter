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
      <Row
        className={testIsDraft === 1 ? 'justify-content-between m-3' : 'justify-content-center m-3'}
      >
        <Button variant='customPrimary' onClick={() => goToAssigner()}>
          Next
        </Button>
        {testIsDraft === 1 && (
          <Button variant='customPrimary' onClick={() => modifyQuestions()}>
            Add/Remove
          </Button>
        )}
      </Row>
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
