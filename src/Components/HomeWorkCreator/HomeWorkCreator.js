import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
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
import {
  getHomeworkQuestionArray,
  getCurrentSlide,
} from '../../redux/reducers/homeworkCreator.reducer';
import { getClientId, getClientUserId } from '../../redux/reducers/clientUserId.reducer';
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
  } = props;
  const [slide, setSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [homeworkQuestionsArray, setQuestionArray] = useState([]);
  const [filterType, setFilterType] = useState('fetched');
  //
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
  //
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (document.body.clientWidth < 600) {
      setIsMobile(true);
    }
    setSlide(currentSlide);
    setQuestionArray(questionArray);
  }, [currentSlide, questionArray]);

  useEffect(() => {
    if (history.location.state && history.location.state.letsGo) {
      clearTests();
    }
  }, [history, clearTests]);

  const addQuestion = () => {};

  const fetchQuestions = (result) => {
    setQuestionArray(result);
    setQuestionArrayToStore(result);
    setCurrentSlide(1);
  };

  const handleBack = () => {
    if (currentSlide === 0) {
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
        <p>Filters</p>
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
          <SelectQuestions setFilterType={setFilterType} history={history} fetch={fetchQuestions} />
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
              solutionImage={solutionImage}
              answerArray={ckAnswerArray}
              add={addQuestion}
              clientId={clientId}
            />
          )}
          {filterType === 'fetched' ? (
            <PreviewQuestions history={history} homeworkQuestions={homeworkQuestionsArray} />
          ) : (
            <PreviewCkeditor
              question={ckQuestion}
              solution={ckSolution}
              options={ckAnswerArray}
              questionImage={questionImage}
              solutionImage={solutionImage}
            />
          )}
        </Carousel>
      </div>
      <div style={{ marginTop: '-3rem' }} className='Homework__desktopViewContainer hideOnMobileHW'>
        <SelectQuestions
          setFilterType={setFilterType}
          desktop
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
            solutionImage={solutionImage}
            answerArray={ckAnswerArray}
            add={addQuestion}
            clientId={clientId}
          />
        )}
        {filterType === 'fetched' ? (
          <PreviewQuestions history={history} homeworkQuestions={homeworkQuestionsArray} />
        ) : (
          <PreviewCkeditor
            question={ckQuestion}
            solution={ckSolution}
            options={ckAnswerArray}
            questionImage={questionImage}
            solutionImage={solutionImage}
          />
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  questionArray: getHomeworkQuestionArray(state),
  clientId: getClientId(state),
  currentSlide: getCurrentSlide(state),
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
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeWorkCreator);

HomeWorkCreator.propTypes = {
  setCurrentSlide: PropTypes.func.isRequired,
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
