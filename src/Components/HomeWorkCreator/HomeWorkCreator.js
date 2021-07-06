import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
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
    clearTests,
  } = props;
  const [slide, setSlide] = useState(0);
  const [homeworkQuestionsArray, setQuestionArray] = useState([]);

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
      <div style={{ marginTop: '7rem' }} className='Homework__carousel'>
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
                  style={selectedIndicatorStyles}
                  aria-label={`Selected: ${label} ${index + 1}`}
                  title={`Selected: ${label} ${index + 1}`}
                >
                  {index === 0 ? 'Filters' : index === 1 ? 'Questions' : 'Selected'}
                </li>
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
              >
                {index === 0 ? 'Filters' : index === 1 ? 'Questions' : 'Selected'}
              </li>
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
