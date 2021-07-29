import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { connect } from 'react-redux';
import Question from './Question';
import { homeworkActions } from '../../redux/actions/homework.action';
import { getSelectedQuestionArray } from '../../redux/reducers/homeworkCreator.reducer';

const PreviewQuestions = (props) => {
  const { selectedQuestionArray, setSelectedQuestionArrayToStore, history } = props;
  const [selectedQuestions, setSelectedQuestions] = useState([]);

  useEffect(() => {
    setSelectedQuestions(selectedQuestionArray);
  }, [selectedQuestionArray]);

  const updateSelectedQuestions = (question) => {
    const updatedSelectedQuestions = selectedQuestions.filter((e) => {
      return e.question_id !== question.question_id;
    });

    setSelectedQuestions(updatedSelectedQuestions);
    setSelectedQuestionArrayToStore(updatedSelectedQuestions);
  };

  const goToPreview = () => {
    history.push('/homework/preview');
  };

  return (
    <Card className='Homework__selectCard mb-3 mx-2'>
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

export default connect(mapStateToProps, mapDispatchToProps)(PreviewQuestions);

PreviewQuestions.propTypes = {
  setSelectedQuestionArrayToStore: PropTypes.func.isRequired,
  selectedQuestionArray: PropTypes.instanceOf(Array).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};
