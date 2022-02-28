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
  getHomeworkLanguageType,
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
    language,
    desktop,
    setHomeworkLanguageTypeToStore,
    compressed,
    setFilterType,
    updateCompressed,
  } = props;
  const [questions, setQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [isDraft, setDraft] = useState(0);
  const [selectAllQuestions, setSelectAllQuestions] = useState(false);

  useEffect(() => {
    console.log(testId);
    const draft = testId === null ? 0 : 1;
    setDraft(draft);
    console.log(draft, 'drraaffftttt');
  }, [testId]);

  useEffect(() => {
    const newQuestions = homeworkQuestions.map((e) => {
      if (e.directFromSaved) {
        e.isSelected = true;
      } else if (e.isSelected) {
        e.isSelected = true;
      } else {
        e.isSelected = false;
      }
      return e;
    });
    setQuestions(newQuestions);
  }, [homeworkQuestions]);

  useEffect(() => {
    setSelectedQuestions(selectedQuestionArray);
  }, [selectedQuestionArray]);

  const removeQuestion = (question) => {
    console.log(question, 'delettteeeee');
    const newSelectedQuestions = JSON.parse(JSON.stringify(selectedQuestions));
    console.log(question);
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
  };

  const removeAllQuestions = () => {
    post(
      {
        questions_array: JSON.stringify(selectedQuestions.map((e) => e.question_id)),
        test_id: testId,
      },
      '/deleteMultipleQuestionFromTest',
    ).then((res) => {
      if (res.success) {
        setSelectedQuestions([]);
        setSelectedQuestionArrayToStore([]);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops',
          text: 'Question could not be removed',
        });
      }
    });
  };

  const addQuestions = (questionArray, selectedQuestionsArray = selectedQuestions) => {
    const newSelectedQuestions = JSON.parse(JSON.stringify(selectedQuestionsArray));

    let payload;
    if (!isDraft) {
      payload = {
        language_type: language || 'english',
        client_id: clientId,
        questions_array: JSON.stringify(questionArray.map((e) => e.question_id)),
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
        questions_array: JSON.stringify(questionArray.map((e) => e.question_id)),
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
          setHomeworkLanguageTypeToStore(language || 'english');
          setCurrentSlide(2);
        }
        newSelectedQuestions.push(...questionArray);
        setSelectedQuestionArrayToStore(newSelectedQuestions);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops',
          text: 'Question could not be added',
        });
      }
    });
  };

  const updateSelectedQuestions = (question) => {
    const ques = [];
    ques.push(question);
    if (question.isSelected === true) {
      addQuestions(ques);
    } else removeQuestion(question);
  };

  const goToNextSlide = () => {
    setCurrentSlide(2);
    console.log('next');
  };

  const selectAll = (value) => {
    setSelectAllQuestions(value);
    if (value) {
      setSelectedQuestions(questions);
      console.log(questions);
      const notSelectedQs = questions.filter((ele) => !ele.isSelected);
      addQuestions(notSelectedQs);

      const allQuestions = questions.map((e) => {
        e.isSelected = true;
        return e;
      });
      // setSelectedQuestionArrayToStore(allQuestions);
      setQuestions(allQuestions);
      setCurrentSlide(2);
    } else {
      removeAllQuestions();
      const resetQuestions = questions.map((e) => {
        e.isSelected = false;
        return e;
      });
      setQuestions(resetQuestions);
    }
  };

  const goToCreateQuestion = () => {
    setFilterType('create');
    setCurrentSlide(1);
  };

  const compressOrExpand = () => {
    // setCompressed((prev) => {
    //   updateCompressed(!prev);
    //   return !prev;
    // });
    // updateCompressed(false);
    console.log('compressed');
  };

  return (
    <Card className={`Homework__selectCard mb-3 mobileMargin${compressed ? ' expanded' : ''}`}>
      <div className='d-flex mb-1 mt-3 mx-2'>
        <span className='text-left Homework__questionIndex my-auto'>
          {
            selectedQuestions.filter((ques) => {
              return questions.find((q) => q.question_id === ques.question_id);
            }).length
          }{' '}
          selected of {questions.length}
        </span>
        <div className='ml-auto hideOnMobileHW'>
          <Button
            variant='customPrimarySmol'
            onClick={() => {
              goToCreateQuestion();
              compressOrExpand();
            }}
            onKeyDown={() => {
              goToCreateQuestion();
              compressOrExpand();
            }}
          >
            Add more manually
          </Button>
        </div>
        <div className='ml-auto my-auto d-flex'>
          <Button variant='customPrimarySmol hideOnDesktopHW' onClick={() => goToNextSlide()}>
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
  testName: getTestName(state),
  clientId: getClientId(state),
  clientUserId: getClientUserId(state),
  currentChapterArray: getCurrentChapterArray(state),
  language: getHomeworkLanguageType(state),
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
  language: PropTypes.string.isRequired,
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
  desktop: PropTypes.bool.isRequired,
  setHomeworkLanguageTypeToStore: PropTypes.func.isRequired,
  compressed: PropTypes.bool,
  setFilterType: PropTypes.func.isRequired,
  updateCompressed: PropTypes.func.isRequired,
};

QuestionList.defaultProps = {
  homeworkQuestions: [],
  selectedQuestionArray: [],
  testId: null,
  compressed: false,
};
