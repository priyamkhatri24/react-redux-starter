import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Swal from 'sweetalert2';
import { connect } from 'react-redux';
import { post } from '../../Utilities';
import Question from './Question';
import { homeworkActions } from '../../redux/actions/homework.action';
import {
  getSelectedQuestionArray,
  getTestId,
  getHomeworkLanguageType,
} from '../../redux/reducers/homeworkCreator.reducer';

const PreviewQuestions = (props) => {
  const {
    homeworkQuestions,
    selectedQuestionArray,
    language,
    setSelectedQuestionArrayToStore,
    history,
    testId,
  } = props;
  const [selectedQuestions, setSelectedQuestions] = useState([]);

  useEffect(() => {
    setSelectedQuestions(selectedQuestionArray);
  }, [selectedQuestionArray]);

  const updateSelectedQuestions = (question) => {
    /* eslint-disable */
    homeworkQuestions.find((e) => e.question_id === question.question_id)
      ? (homeworkQuestions.find((e) => e.question_id === question.question_id).isSelected = false)
      : null;
    const newSelectedQuestions = JSON.parse(JSON.stringify(selectedQuestions));
    const updatedSelectedQuestions = selectedQuestions.filter((e) => {
      return e.question_id !== question.question_id;
    });
    post({ question_id: question.question_id, test_id: testId }, '/deleteQuestionFromTest').then(
      (res) => {
        if (res.success) {
          console.log(res, 'deleteeddd');
          const removedSelectedQuestions = newSelectedQuestions.filter((e) => {
            return e.question_id !== question.question_id;
          });
          setSelectedQuestions(updatedSelectedQuestions);
          setSelectedQuestionArrayToStore(removedSelectedQuestions);
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops',
            text: 'Question could not be removed',
          });
        }
      },
    );
    // setSelectedQuestionArrayToStore(updatedSelectedQuestions);
  };

  const goToPreview = () => {
    history.push('/homework/preview');
  };

  return (
    <Card className='Homework__selectCard mb-3 mobileMargin'>
      <div className='d-flex mt-3 mx-2'>
        <span className='text-left Homework__questionIndex my-auto'>
          {selectedQuestions.length} selected
        </span>
        <div className='ml-auto my-auto'>
          <Button variant='customPrimarySmol' onClick={() => goToPreview()}>
            Save
          </Button>
        </div>
      </div>
      <hr />
      {selectedQuestions.map((e, index) => {
        return (
          <Question
            question={e}
            index={index + 1}
            update={updateSelectedQuestions}
            key={e.question_id}
            language={language}
          />
        );
      })}
    </Card>
  );
};

const mapStateToProps = (state) => ({
  selectedQuestionArray: getSelectedQuestionArray(state),
  testId: getTestId(state),
  language: getHomeworkLanguageType(state),
});

const mapDispatchToProps = (dispatch) => {
  return {
    setSelectedQuestionArrayToStore: (payload) => {
      dispatch(homeworkActions.setSelectedQuestionArrayToStore(payload));
    },
    setCurrentSlide: (payload) => {
      dispatch(homeworkActions.setCurrentSlide(payload));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PreviewQuestions);

PreviewQuestions.propTypes = {
  setSelectedQuestionArrayToStore: PropTypes.func.isRequired,
  homeworkQuestions: PropTypes.instanceOf(Array),
  language: PropTypes.string.isRequired,
  selectedQuestionArray: PropTypes.instanceOf(Array).isRequired,
  testId: PropTypes.number.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};
PreviewQuestions.defaultProps = {
  homeworkQuestions: [],
};
