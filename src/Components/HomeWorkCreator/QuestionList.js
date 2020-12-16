import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { connect } from 'react-redux';
import Question from './Question';
import { homeworkActions } from '../../redux/actions/homework.action';
import { getSelectedQuestionArray } from '../../redux/reducers/homeworkCreator.reducer';

const QuestionList = (props) => {
  const {
    homeworkQuestions,
    setSelectedQuestionArrayToStore,
    selectedQuestionArray,
    setCurrentSlide,
  } = props;
  const [questions, setQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);

  useEffect(() => {
    const newQuestions = homeworkQuestions.map((e) => {
      e.isSelected = false;
      return e;
    });
    setQuestions(newQuestions);
  }, [homeworkQuestions]);

  useEffect(() => {
    setSelectedQuestions(selectedQuestionArray);
  }, [selectedQuestionArray]);

  const updateSelectedQuestions = (question) => {
    const newSelectedQuestions = JSON.parse(JSON.stringify(selectedQuestions));
    if (question.isSelected === true) {
      newSelectedQuestions.push(question);
      setSelectedQuestionArrayToStore(newSelectedQuestions);
    } else {
      const removedSelectedQuestions = newSelectedQuestions.filter((e) => {
        return e.question_id !== question.question_id;
      });
      setSelectedQuestionArrayToStore(removedSelectedQuestions);
    }
  };

  const clearSelectedQuestions = () => {
    setSelectedQuestionArrayToStore([]);
    const resetQuestions = questions.map((e) => {
      e.isSelected = false;
      return e;
    });
    setQuestions(resetQuestions);
  };

  const goToNextSlide = () => {
    setCurrentSlide(2);
  };

  return (
    <Card className='Homework__selectCard mb-3 mx-2'>
      <div className='d-flex mt-3 mx-2'>
        <span className='text-left Homework__questionIndex my-auto'>
          {selectedQuestions.length} selected of {questions.length}
        </span>
        <div className='ml-auto my-auto'>
          <Button variant='customPrimarySmol' onClick={() => goToNextSlide()}>
            Next
          </Button>

          <Button
            variant='customPrimarySmol'
            className='ml-2'
            onClick={() => clearSelectedQuestions()}
          >
            Clear
          </Button>
        </div>
      </div>
      <hr />
      {questions.map((e, index) => {
        return (
          <Question
            question={e}
            index={index + 1}
            update={updateSelectedQuestions}
            key={e.question_id}
          />
        );
      })}
    </Card>
  );
};

const mapStateToProps = (state) => ({
  selectedQuestionArray: getSelectedQuestionArray(state),
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

export default connect(mapStateToProps, mapDispatchToProps)(QuestionList);
