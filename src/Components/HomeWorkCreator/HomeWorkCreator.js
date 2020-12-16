import React, { useState, useEffect } from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { connect } from 'react-redux';
import { PageHeader } from '../Common';
import PreviewQuestions from './PreviewQuestions';
import QuestionList from './QuestionList';
import SelectQuestions from './SelectQuestions';
import {
  getHomeworkQuestionArray,
  getCurrentSlide,
} from '../../redux/reducers/homeworkCreator.reducer';
import { homeworkActions } from '../../redux/actions/homework.action';
import './HomeWorkCreator.scss';

const HomeWorkCreator = (props) => {
  const {
    history,
    questionArray,
    currentSlide,
    setQuestionArrayToStore,
    setCurrentSlide,
    setSelectedQuestionArrayToStore,
  } = props;
  const [slide, setSlide] = useState(0);
  const [homeworkQuestionsArray, setQuestionArray] = useState([]);

  useEffect(() => {
    setSlide(currentSlide);
    setQuestionArray(questionArray);
  }, [currentSlide, questionArray]);

  useEffect(() => {
    if (history.location.state.letsGo) {
      setQuestionArrayToStore([]);
      setSelectedQuestionArrayToStore([]);
      setCurrentSlide(0);
    }
  }, [
    history.location.state.letsGo,
    setCurrentSlide,
    setQuestionArrayToStore,
    setSelectedQuestionArrayToStore,
  ]);

  const fetchQuestions = (result) => {
    setQuestionArray(result);
    setQuestionArrayToStore(result);
    setCurrentSlide(1);
  };

  const indicatorStyles = {
    background: 'rgba(0, 0, 0, 0.11)',
    width: '3rem',
    height: '0.5rem',
    display: 'inline-block',
    margin: '0 8px',
    borderRadius: '5px',
  };

  return (
    <div className='Homework'>
      <PageHeader title='Homework Creator' />
      <div style={{ marginTop: '7rem' }} className='Homework__carousel'>
        <Carousel
          style={{ backgroundColor: 'red' }}
          showArrows={false}
          showThumbs={false}
          autoPlay={false}
          showStatus={false}
          selectedItem={slide}
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
                role='button'
                tabIndex={0}
                title={`${label} ${index + 1}`}
                aria-label={`${label} ${index + 1}`}
              />
            );
          }}
        >
          <SelectQuestions history={history} fetch={fetchQuestions} />
          <QuestionList homeworkQuestions={homeworkQuestionsArray} />
          <PreviewQuestions history={history} />
        </Carousel>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  questionArray: getHomeworkQuestionArray(state),
  currentSlide: getCurrentSlide(state),
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
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeWorkCreator);
