import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Swal from 'sweetalert2';
import PropTypes from 'prop-types';
import { Carousel } from 'react-responsive-carousel';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { PageHeader } from '../Common';
import CkeditorQuestion from './CkeditorQuestion';
import PreviewCkeditor from './PreviewCkeditor';
import { getClientId, getClientUserId } from '../../redux/reducers/clientUserId.reducer';
import { apiValidation, get, post } from '../../Utilities';
import {
  getSelectedQuestionArray,
  getHomeworkQuestionArray,
  getTestId,
  getTestName,
  getCurrentChapterArray,
  getCurrentSubjectArray,
} from '../../redux/reducers/homeworkCreator.reducer';
import { homeworkActions } from '../../redux/actions/homework.action';

const CreateQuestion = (props) => {
  const {
    clientId,
    clientUserId,
    setCurrentSlide,
    setSelectedQuestionArrayToStore,
    selectedQuestionArray,
    questionArray,
    setQuestionArrayToStore,
    history,
    testId,
    testName,
    currentChapterArray,
    currentSubjectArray,
    setTestIdToStore,
    setTestNameToStore,
  } = props;
  const [ckQuestion, setCkQuestion] = useState('');
  const [questionImage, setQuestionImage] = useState('');
  const [ckSolution, setCkSolution] = useState('');
  const [solutionImage, setSolutionImage] = useState('');
  const [ckAnswerArray, setCkAnswerArray] = useState([
    { value: '1', image: '', isSelected: false, text: '' },
    { value: '2', image: '', isSelected: false, text: '' },
    { value: '3', image: '', isSelected: false, text: '' },
    { value: '4', image: '', isSelected: false, text: '' },
  ]);

  const indicatorStyles = {
    background: 'rgba(0, 0, 0, 0.11)',
    width: '3rem',
    height: '0.5rem',
    display: 'inline-block',
    margin: '0 8px',
    borderRadius: '5px',
  };

  const addQuestion = (payload) => {
    console.log('hi!', payload);

    const initialAnswer = [];

    ckAnswerArray.forEach((elem) => {
      if (elem.isSelected === true) initialAnswer.push(elem.value);
    });

    const answer = JSON.stringify(
      initialAnswer.map((e) => {
        let elem;
        e === '1'
          ? (elem = 'A')
          : e === '2'
          ? (elem = 'B')
          : e === '3'
          ? (elem = 'C')
          : (elem = 'D');
        return elem;
      }),
    );

    const options = ckAnswerArray.map((e) => e.text).join('~');
    const optionsImage = ckAnswerArray.map((e) => e.image).join('~');

    const finalPayload = {
      macroskill_array: null,
      chapter_id: payload.selectedChapter,
      question_text: ckQuestion,
      question_type: payload.type,
      question_positive_marks: null,
      question_negative_marks: null,
      question_level: null,
      question_average_time: null,
      question_tag: null,
      question_comment: null,
      question_image: questionImage,
      question_solution_text: ckSolution,
      question_answer: payload.type === 'subjective' ? ckSolution : answer,
      question_solution_image: solutionImage,
      client_id: clientId,
      options,
      option_image: optionsImage,
      option_tag: null,
      option_comment: null,
      hindi_options: null,
      hindi_text: null,
      hindi_solution_text: null,
    };

    post(finalPayload, '/addQuestion').then((res) => {
      console.log(res);
      const result = apiValidation(res);
      let addQuestionPayload;
      const ques = [];
      ques.push(result.question_id);
      const isDraft = testId === null ? 0 : 1;
      if (!isDraft) {
        addQuestionPayload = {
          language_type: 'english',
          client_id: clientId,
          questions_array: JSON.stringify(ques),
          is_draft: isDraft,
          chapter_array: JSON.stringify(currentChapterArray),
          teacher_id: clientUserId,
          class_subject: JSON.stringify(currentSubjectArray),
        };
      } else {
        addQuestionPayload = {
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
      console.log(addQuestionPayload);

      post(addQuestionPayload, '/addTestFromHomeworkCreator').then((response) => {
        if (response.success) {
          if (!isDraft) {
            setTestIdToStore(response.test_id);
            setTestNameToStore(response.test_name);
          }

          get({ question_id: result.question_id }, '/getQuestionDetails').then((resp) => {
            console.log(resp);
            const newQuestion = apiValidation(resp);
            newQuestion[0].isSelected = true;
            selectedQuestionArray.push(newQuestion[0]);
            setSelectedQuestionArrayToStore(selectedQuestionArray);
            setCurrentSlide(1);
            questionArray.push(newQuestion[0]);
            setQuestionArrayToStore(questionArray);
            history.push({ pathname: '/homework', state: { letsGo: false } });
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops',
            text: 'Question could not be added',
          });
        }
      });
    });
  };

  useEffect(() => {
    console.log(ckAnswerArray);
  }, [ckAnswerArray]);

  return (
    <div>
      <PageHeader title='Create Question' />
      <div style={{ marginTop: '7rem' }} className='Homework__carousel d-lg-none'>
        <Carousel
          style={{ backgroundColor: 'red' }}
          showArrows={false}
          showThumbs={false}
          autoPlay={false}
          showStatus={false}
          selectedItem={0}
          renderIndicator={(onClickHandler, isSelected, index, label) => {
            if (isSelected) {
              return (
                <li
                  style={{ ...indicatorStyles, background: 'var(--primary-blue)' }}
                  aria-label={`Selected: ${label} ${index + 1}`}
                  title={`Selected: ${label} ${index + 1}`}
                />
              );
            }
            return (
              <li
                style={indicatorStyles}
                onClick={onClickHandler}
                onKeyDown={onClickHandler}
                value={index}
                key={index}
                role='button' // eslint-disable-line
                tabIndex={0}
                title={`${label} ${index + 1}`}
                aria-label={`${label} ${index + 1}`}
              />
            );
          }}
        >
          <CkeditorQuestion
            updateQuestion={setCkQuestion}
            updateSolution={setCkSolution}
            updateOptionArray={setCkAnswerArray}
            updateQuestionImages={setQuestionImage}
            updateSolutionImage={setSolutionImage}
            questionImage={questionImage}
            solutionImage={solutionImage}
            answerArray={ckAnswerArray}
            add={addQuestion}
          />
          <PreviewCkeditor
            question={ckQuestion}
            solution={ckSolution}
            options={ckAnswerArray}
            questionImage={questionImage}
            solutionImage={solutionImage}
          />
        </Carousel>
      </div>
      <Row className='d-none d-lg-flex ' style={{ marginTop: '5rem' }}>
        <Col xs={8} className='p-0'>
          <CkeditorQuestion
            updateQuestion={setCkQuestion}
            updateSolution={setCkSolution}
            updateOptionArray={setCkAnswerArray}
            updateQuestionImages={setQuestionImage}
            updateSolutionImage={setSolutionImage}
            questionImage={questionImage}
            solutionImage={solutionImage}
            answerArray={ckAnswerArray}
            add={addQuestion}
          />
        </Col>
        <Col xs={4}>
          <PreviewCkeditor
            question={ckQuestion}
            solution={ckSolution}
            options={ckAnswerArray}
            questionImage={questionImage}
            solutionImage={solutionImage}
          />
        </Col>
      </Row>
    </div>
  );
};

const mapStateToProps = (state) => ({
  clientId: getClientId(state),
  clientUserId: getClientUserId(state),
  testId: getTestId(state),
  testName: getTestName(state),
  selectedQuestionArray: getSelectedQuestionArray(state),
  questionArray: getHomeworkQuestionArray(state),
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
    setQuestionArrayToStore: (payload) => {
      dispatch(homeworkActions.setQuestionArrayToStore(payload));
    },
    setTestIdToStore: (payload) => {
      dispatch(homeworkActions.setTestIdToStore(payload));
    },
    setTestNameToStore: (payload) => {
      dispatch(homeworkActions.setTestNameToStore(payload));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateQuestion);

CreateQuestion.propTypes = {
  clientId: PropTypes.number.isRequired,
  clientUserId: PropTypes.number.isRequired,
  testId: PropTypes.number.isRequired,
  testName: PropTypes.string.isRequired,
  currentChapterArray: PropTypes.instanceOf(Array).isRequired,
  currentSubjectArray: PropTypes.instanceOf(Array).isRequired,
  setSelectedQuestionArrayToStore: PropTypes.func.isRequired,
  setCurrentSlide: PropTypes.func.isRequired,
  selectedQuestionArray: PropTypes.instanceOf(Array).isRequired,
  questionArray: PropTypes.instanceOf(Array).isRequired,
  setQuestionArrayToStore: PropTypes.func.isRequired,
  setTestIdToStore: PropTypes.func.isRequired,
  setTestNameToStore: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};
