import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { connect } from 'react-redux';
import Question from './Question';
import { homeworkActions } from '../../redux/actions/homework.action';
import {
  getCurrentChapterArray,
  getCurrentSubjectArray,
  getSelectedQuestionArray,
  getTestId,
  getTestName,
} from '../../redux/reducers/homeworkCreator.reducer';
import { getClientId, getClientUserId } from '../../redux/reducers/clientUserId.reducer';
import { post } from '../../Utilities';

const QuestionList = (props) => {
  const {
    homeworkQuestions,
    setSelectedQuestionArrayToStore,
    selectedQuestionArray,
    setCurrentSlide,
    testId,
    testName,
    clientId,
    clientUserId,
    currentChapterArray,
    currentSubjectArray,
    setTestIdToStore,
    setTestNameToStore,
    setTestIsDraftToStore,
    setHomeworkLanguageTypeToStore,
  } = props;
  const [questions, setQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [isDraft, setDraft] = useState(0);
  const [selectAllQuestions, setSelectAllQuestions] = useState(false);

  useEffect(() => {
    const draft = testId === null ? 0 : 1;
    setDraft(draft);
  }, [testId]);

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
    const ques = [];
    ques.push(question.question_id);
    const newSelectedQuestions = JSON.parse(JSON.stringify(selectedQuestions));
    if (question.isSelected === true) {
      let payload;
      if (!isDraft) {
        payload = {
          language_type: 'english',
          client_id: clientId,
          questions_array: JSON.stringify(ques),
          is_draft: isDraft,
          chapter_array: JSON.stringify(currentChapterArray),
          teacher_id: clientUserId,
          class_subject: JSON.stringify(currentSubjectArray),
        };
      } else {
        payload = {
          chapter_array: JSON.stringify(currentChapterArray),
          teacher_id: clientUserId,
          test_id: testId,
          is_draft: isDraft,
          questions_array: JSON.stringify(ques),
          class_subject: JSON.stringify(currentSubjectArray),
          client_id: clientId,
          test_name: testName,
        };
      }
      console.log(payload);
      post(payload, '/addTestFromHomeworkCreator').then((res) => {
        if (res.success) {
          if (!isDraft) {
            setTestIdToStore(res.test_id);
            setTestNameToStore(res.test_name);
            setTestIsDraftToStore(1);
            setHomeworkLanguageTypeToStore('english');
          }
          newSelectedQuestions.push(question);
          setSelectedQuestionArrayToStore(newSelectedQuestions);
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops',
            text: 'Question could not be added',
          });
        }
      });
    } else {
      post({ question_id: question.question_id, test_id: testId }, '/deleteQuestionFromTest').then(
        (res) => {
          if (res.success) {
            const removedSelectedQuestions = newSelectedQuestions.filter((e) => {
              return e.question_id !== question.question_id;
            });
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
    }
  };

  const goToNextSlide = () => {
    setCurrentSlide(2);
  };

  const selectAll = (value) => {
    setSelectAllQuestions(value);
    if (value) {
      setSelectedQuestionArrayToStore(questions);
      const allQuestions = questions.map((e) => {
        e.isSelected = true;
        return e;
      });
      setQuestions(allQuestions);
      setCurrentSlide(2);
    } else {
      setSelectedQuestionArrayToStore([]);
      const resetQuestions = questions.map((e) => {
        e.isSelected = false;
        return e;
      });
      setQuestions(resetQuestions);
    }
  };

  return (
    <Card className='Homework__selectCard mb-3 mx-2'>
      <div className='d-flex mt-3 mx-2'>
        <span className='text-left Homework__questionIndex my-auto'>
          {selectedQuestions.length} selected of {questions.length}
        </span>
        <div className='ml-auto my-auto d-flex'>
          <Button variant='customPrimarySmol' onClick={() => goToNextSlide()}>
            Next
          </Button>

          <Form.Check
            type='checkbox'
            checked={selectAllQuestions}
            onChange={(e) => selectAll(!selectAllQuestions)}
            className='my-auto ml-1'
            label='Select All'
            name='selectAll'
          />
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
  testId: getTestId(state),
  testName: getTestName(state),
  clientId: getClientId(state),
  clientUserId: getClientUserId(state),
  currentChapterArray: getCurrentChapterArray(state),
  currentSubjectArray: getCurrentSubjectArray(state),
});

const mapDispatchToProps = (dispatch) => {
  return {
    setSelectedQuestionArrayToStore: (payload) => {
      dispatch(homeworkActions.setSelectedQuestionArrayToStore(payload));
    },
    setCurrentSlide: (payload) => {
      dispatch(homeworkActions.setCurrentSlide(payload));
    },
    setTestIdToStore: (payload) => {
      dispatch(homeworkActions.setTestIdToStore(payload));
    },
    setTestNameToStore: (payload) => {
      dispatch(homeworkActions.setTestNameToStore(payload));
    },
    setTestIsDraftToStore: (payload) => {
      dispatch(homeworkActions.setTestIsDraftToStore(payload));
    },
    setHomeworkLanguageTypeToStore: (payload) => {
      dispatch(homeworkActions.setHomeworkLanguageTypeToStore(payload));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(QuestionList);

QuestionList.propTypes = {
  clientId: PropTypes.number.isRequired,
  clientUserId: PropTypes.number.isRequired,
  setCurrentSlide: PropTypes.func.isRequired,
  setTestIdToStore: PropTypes.func.isRequired,
  setTestNameToStore: PropTypes.func.isRequired,
  currentChapterArray: PropTypes.instanceOf(Array).isRequired,
  currentSubjectArray: PropTypes.instanceOf(Array).isRequired,
  setSelectedQuestionArrayToStore: PropTypes.func.isRequired,
  homeworkQuestions: PropTypes.instanceOf(Array),
  selectedQuestionArray: PropTypes.instanceOf(Array),
  testId: PropTypes.number,
  testName: PropTypes.string.isRequired,
  setTestIsDraftToStore: PropTypes.func.isRequired,
  setHomeworkLanguageTypeToStore: PropTypes.func.isRequired,
};

QuestionList.defaultProps = {
  homeworkQuestions: [],
  selectedQuestionArray: [],
  testId: null,
};
