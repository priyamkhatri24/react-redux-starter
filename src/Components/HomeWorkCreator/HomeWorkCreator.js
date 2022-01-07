import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { connect } from 'react-redux';
import { PageHeader } from '../Common';
import PreviewQuestions from './PreviewQuestions';
import QuestionList from './QuestionList';
import CreateQuestion from './CreateQuestion';
import SelectQuestions from './SelectQuestions';
import CkeditorQuestion from './CkeditorQuestion';
import PreviewCkeditor from './PreviewCkeditor';
import BottomNavigation from '../Common/BottomNavigation/BottomNavigation';
import { getClientId, getClientUserId } from '../../redux/reducers/clientUserId.reducer';
import { apiValidation, get, post } from '../../Utilities';
import {
  getSelectedQuestionArray,
  getHomeworkQuestionArray,
  getCurrentSlide,
  getTestId,
  getTestName,
  getCurrentChapterArray,
  getCurrentSubjectArray,
} from '../../redux/reducers/homeworkCreator.reducer';
import { homeworkActions } from '../../redux/actions/homework.action';
import './HomeWorkCreator.scss';

const HomeWorkCreator = (props) => {
  const {
    history,
    clientId,
    questionArray,
    currentSlide,
    setQuestionArrayToStore,
    setCurrentSlide,
    clearTests,
    clientUserId,
    setSelectedQuestionArrayToStore,
    selectedQuestionArray,
    testId,
    testName,
    currentChapterArray,
    currentSubjectArray,
    setTestIdToStore,
    setTestNameToStore,
    setSelectedCourseToStore,
    setSelectedChapterToStore,
    setSelectedSubjectToStore,
  } = props;
  const [slide, setSlide] = useState(0);
  const [homeworkQuestionsArray, setQuestionArray] = useState([]);
  const [filterType, setFilterType] = useState('fetched');
  const [ckQuestion, setCkQuestion] = useState('');
  const [type, setType] = useState('');
  const [questionImage, setQuestionImage] = useState('');
  const [ckSolution, setCkSolution] = useState('');
  const [ckAnswerText, setCkAnswerText] = useState('');
  const [solutionImage, setSolutionImage] = useState('');
  const [compressed, setCompressed] = useState(false);
  const [ckAnswerArray, setCkAnswerArray] = useState([
    { value: '1', image: '', isSelected: false, text: '' },
    { value: '2', image: '', isSelected: false, text: '' },
    { value: '3', image: '', isSelected: false, text: '' },
    { value: '4', image: '', isSelected: false, text: '' },
  ]);
  //
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const onUnload = (e) => {
    const message = 'o/';
    (e || window.event).returnValue = message; // Gecko + IE
    return message;
  };

  useEffect(() => {
    window.addEventListener('beforeunload', onUnload);

    return () => {
      window.removeEventListener('beforeunload', onUnload);
      // history.push('/');
    };
  }, []);

  const addQuestion = (payload) => {
    console.log('hi!', payload);

    const initialAnswer = [];

    ckAnswerArray.forEach((elem) => {
      if (elem.isSelected === true) initialAnswer.push(elem.value);
    });

    const answer = initialAnswer.map((e) => {
      let elem;
      e === '1'
        ? (elem = '[A]')
        : e === '2'
        ? (elem = '[B]')
        : e === '3'
        ? (elem = '[C]')
        : e === '4'
        ? (elem = '[D]')
        : e === '5'
        ? (elem = '[E]')
        : (elem = '[F]');
      return elem;
    });

    const optionsArr = ckAnswerArray.map((e) => e.text);
    const options = optionsArr.join('').length ? optionsArr.join('~') : '';
    const optionsImageArr = ckAnswerArray.map((e) => e.image);
    const optionsImage = optionsImageArr.join('').length ? optionsImageArr.join('~') : '';

    const finalPayload = {
      macroskill_array: null,
      chapter_id: payload.selectedChapter.chapter_id,
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
      question_answer: payload.type === 'subjective' ? ckAnswerText : answer,
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

    // console.log(currentChapterArray, currentSubjectArray, 'missing elements');

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
          chapter_array: JSON.stringify(currentChapterArray), //
          teacher_id: clientUserId,
          class_subject: JSON.stringify(currentSubjectArray), //
        };
      } else {
        addQuestionPayload = {
          chapter_array: JSON.stringify(currentChapterArray), //
          teacher_id: clientUserId,
          test_id: testId,
          is_draft: isDraft,
          questions_array: JSON.stringify(ques),
          class_subject: JSON.stringify(currentSubjectArray), //
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
            setQuestionArray(newQuestion);
            setQuestionArrayToStore(newQuestion);
            setFilterType('fetched');
            // history.push({ pathname: '/homework', state: { letsGo: false } });
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
    setSlide(currentSlide);
    setQuestionArray(questionArray);
  }, [currentSlide, questionArray]);

  useEffect(() => {
    if (history.location.state && history.location.state.letsGo) {
      clearTests();
    }
  }, [history, clearTests]);

  const fetchQuestions = (result) => {
    setQuestionArray(result);
    setQuestionArrayToStore(result);
    setCurrentSlide(1);
  };

  const handleBack = () => {
    if (currentSlide === 0) {
      setSelectedCourseToStore('');
      setSelectedChapterToStore('');
      setSelectedSubjectToStore('');
      history.push('/');
    } else if (currentSlide === 1) {
      setCurrentSlide(0);
    } else if (currentSlide === 2) {
      setCurrentSlide(1);
    }
  };

  const selectedIndicatorStyles = {
    display: 'inline-block',
    margin: '0 8px',
    fontFamily: 'Montserrat-Bold',
    fontSize: '16px',
    lineHeight: '19px',
    color: 'var(--primary-blue)',
    borderBottom: '5px solid var(--primary-blue)',
    marginTop: '1rem',
  };

  const indicatorStyles = {
    fontSize: '14px',
    lineHeight: '20px',
    color: 'rgba(0, 0, 0, 0.54)',
    display: 'inline-block',
    margin: '0 8px',
    borderRadius: '5px',
    fontFamily: 'Montserrat-Medium',
    marginTop: '1rem',
  };

  return (
    <div className='Homework'>
      <PageHeader title='Homework Creator' handleBack={handleBack} customBack />
      {/* <div style={{ marginTop: '7rem' }} className='Homework__carousel'>
        <div className='mt-3 mx-2 onlyOnMobile'>
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
        <p className='fixedPosition'>haha</p>
      </div> */}
      <div
        style={{ marginTop: '5rem' }}
        className='hideOnMobileHW d-flex justify-content-around w-100 desktopHeadingsDiv'
      >
        {!compressed ? <p>Filters</p> : null}
        {filterType === 'fetched' ? <p>Questions</p> : <p>Add question</p>}
        {filterType === 'fetched' ? <p>Selected</p> : <p>Preview</p>}
      </div>
      <div style={{ marginTop: '7rem' }} className='Homework__carousel hideOnDesktopHW'>
        <Carousel
          style={{ backgroundColor: 'red' }}
          showArrows={false}
          showThumbs={false}
          autoPlay={false}
          showStatus={false}
          swipeable={false}
          selectedItem={slide}
          renderIndicator={(onClickHandler, isSelected, index, label) => {
            if (isSelected) {
              return (
                <li
                  // className='marginOnDesk'
                  style={selectedIndicatorStyles}
                  aria-label={`Selected: ${label} ${index + 1}`}
                  title={`Selected: ${label} ${index + 1}`}
                >
                  {index === 0
                    ? 'Filters'
                    : index === 1
                    ? `${filterType === 'fetched' ? 'Questions' : 'Add question'}`
                    : `${filterType === 'fetched' ? 'Selected' : 'Preview'}`}
                </li>
              );
            }
            return (
              <li
                // className='marginOnDesk'
                style={indicatorStyles}
                onClick={() => setCurrentSlide(index)}
                onKeyDown={() => setCurrentSlide(index)}
                value={index}
                key={index}
                role='button' // eslint-disable-line
                tabIndex={0}
                title={`${label} ${index + 1}`}
                aria-label={`${label} ${index + 1}`}
              >
                {index === 0
                  ? 'Filters'
                  : index === 1
                  ? `${filterType === 'fetched' ? 'Questions' : 'Add question'}`
                  : `${filterType === 'fetched' ? 'Selected' : 'Preview'}`}
              </li>
            );
          }}
        >
          <SelectQuestions
            clientUserId={clientUserId}
            clientId={clientId}
            setFilterType={setFilterType}
            history={history}
            fetch={fetchQuestions}
          />
          {filterType === 'fetched' ? (
            <QuestionList homeworkQuestions={homeworkQuestionsArray} />
          ) : (
            <CkeditorQuestion
              updateQuestion={setCkQuestion}
              updateSolution={setCkSolution}
              updateOptionArray={setCkAnswerArray}
              updateQuestionImages={setQuestionImage}
              updateSolutionImage={setSolutionImage}
              questionImage={questionImage}
              questionText={ckQuestion}
              solutionImage={solutionImage}
              answerArray={ckAnswerArray}
              add={addQuestion}
              setFilterType={setFilterType}
              clientId={clientId}
              updateAnswerText={setCkAnswerText}
              updateType={setType}
              answerText={ckAnswerText}
            />
          )}
          {filterType === 'fetched' ? (
            <PreviewQuestions
              history={history}
              homeworkQuestions={homeworkQuestionsArray}
              updateQuestionArray={setQuestionArray}
            />
          ) : (
            <PreviewCkeditor
              question={ckQuestion}
              solution={ckSolution}
              options={ckAnswerArray}
              questionImage={questionImage}
              answerText={ckAnswerText}
              type={type}
              solutionImage={solutionImage}
            />
          )}
        </Carousel>
      </div>
      <div
        style={{ marginTop: '-3rem', marginBottom: '0.5rem' }}
        className='Homework__desktopViewContainer hideOnMobileHW'
      >
        <SelectQuestions
          setFilterType={setFilterType}
          desktop
          clientId={clientId}
          history={history}
          fetch={fetchQuestions}
          updateCompressed={setCompressed}
          clientUserId={clientUserId}
        />

        {filterType === 'fetched' ? (
          <QuestionList compressed={compressed} homeworkQuestions={homeworkQuestionsArray} />
        ) : (
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
            questionText={ckQuestion}
            clientId={clientId}
            answerText={ckAnswerText}
            setFilterType={setFilterType}
            updateAnswerText={setCkAnswerText}
            updateType={setType}
            compressed={compressed}
          />
        )}
        {filterType === 'fetched' ? (
          <PreviewQuestions
            compressed={compressed}
            history={history}
            homeworkQuestions={homeworkQuestionsArray}
            updateQuestionArray={setQuestionArray}
          />
        ) : (
          <PreviewCkeditor
            question={ckQuestion}
            solution={ckSolution}
            options={ckAnswerArray}
            questionImage={questionImage}
            answerText={ckAnswerText}
            solutionImage={solutionImage}
            type={type}
            compressed={compressed}
            answerText={ckAnswerText}
          />
        )}
      </div>
      <BottomNavigation history={history} activeNav='homeworkCreator' />
    </div>
  );
};

const mapStateToProps = (state) => ({
  questionArray: getHomeworkQuestionArray(state),
  clientId: getClientId(state),
  currentSlide: getCurrentSlide(state),
  clientUserId: getClientUserId(state),
  testId: getTestId(state),
  testName: getTestName(state),
  selectedQuestionArray: getSelectedQuestionArray(state),
  currentChapterArray: getCurrentChapterArray(state),
  currentSubjectArray: getCurrentSubjectArray(state),
});

const mapDispatchToProps = (dispatch) => {
  return {
    setCurrentSlide: (payload) => {
      dispatch(homeworkActions.setCurrentSlide(payload));
    },
    setQuestionArrayToStore: (payload) => {
      dispatch(homeworkActions.setQuestionArrayToStore(payload));
    },
    clearTests: () => {
      dispatch(homeworkActions.clearTests());
    },
    setSelectedQuestionArrayToStore: (payload) => {
      dispatch(homeworkActions.setSelectedQuestionArrayToStore(payload));
    },
    setTestIdToStore: (payload) => {
      dispatch(homeworkActions.setTestIdToStore(payload));
    },
    setTestNameToStore: (payload) => {
      dispatch(homeworkActions.setTestNameToStore(payload));
    },
    setSelectedCourseToStore: (payload) => {
      dispatch(homeworkActions.setSelectedCourseToStore(payload));
    },
    setSelectedSubjectToStore: (payload) => {
      dispatch(homeworkActions.setSelectedSubjectToStore(payload));
    },
    setSelectedChapterToStore: (payload) => {
      dispatch(homeworkActions.setSelectedChapterToStore(payload));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeWorkCreator);

HomeWorkCreator.propTypes = {
  setCurrentSlide: PropTypes.func.isRequired,
  setTestIdToStore: PropTypes.func.isRequired,
  setTestNameToStore: PropTypes.func.isRequired,
  setSelectedQuestionArrayToStore: PropTypes.isRequired,
  clientUserId: PropTypes.number.isRequired,
  testId: PropTypes.number.isRequired,
  testName: PropTypes.string.isRequired,
  selectedQuestionArray: PropTypes.instanceOf(Array).isRequired,
  currentChapterArray: PropTypes.instanceOf(Array).isRequired,
  currentSubjectArray: PropTypes.instanceOf(Array).isRequired,
  clientId: PropTypes.number.isRequired,
  clearTests: PropTypes.func.isRequired,
  currentSlide: PropTypes.number.isRequired,
  history: PropTypes.shape({
    location: PropTypes.shape({
      state: PropTypes.shape({
        letsGo: PropTypes.bool,
      }),
    }),
    push: PropTypes.func.isRequired,
  }),
  setQuestionArrayToStore: PropTypes.func.isRequired,
  questionArray: PropTypes.instanceOf(Array).isRequired,
  setSelectedCourseToStore: PropTypes.instanceOf(Object).isRequired,
  setSelectedChapterToStore: PropTypes.instanceOf(Object).isRequired,
  setSelectedSubjectToStore: PropTypes.instanceOf(Object).isRequired,
};

HomeWorkCreator.defaultProps = {
  history: PropTypes.shape({
    location: PropTypes.shape({
      state: PropTypes.shape({
        letsGo: false,
      }),
    }),
  }),
};
