import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import MathJax from 'react-mathjax-preview';
import { propComparator } from '../../../Utilities';

class QuestionCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      question: {},
      timer: 0,
      answer: '',
      checked: [],
      review: false,
    };
  }

  componentDidMount() {
    const { currentQuestion } = this.props;
    if (Object.keys(currentQuestion).length > 0) {
      currentQuestion.option_array.sort(propComparator('order'));

      this.setState({ question: currentQuestion, timer: currentQuestion.timer });
    }
  }

  componentDidUpdate(prevProps) {
    const { currentQuestion, onUnmount } = this.props;
    const { answer } = this.state;
    const { timer, question, review } = this.state;

    if (prevProps.currentQuestion !== currentQuestion) {
      const falseChecked = currentQuestion.option_array.map((elem) => {
        return false;
      });

      this.setState({ timer: currentQuestion.timer, checked: falseChecked, review: false });
      onUnmount({
        time: timer,
        count: question.noOfTimesVisited + 1,
        uuid: prevProps.currentQuestion.uuid,
        review,
      });
      this.restartSectionTimer();
      this.setState({ answer: '' });
    }
  }

  static getDerivedStateFromProps(props, state) {
    if (props.currentQuestion) {
      props.currentQuestion.option_array.sort(propComparator('order'));
      return {
        ...state,
        question: props.currentQuestion,
      };
    }
    return state;
  }

  componentWillUnmount() {
    clearInterval(this.sectionTimeIntervalId);
    // remove the focused if not save and next done
  }

  /** ********Timer logic***** */

  restartSectionTimer = () => {
    if (this.sectionTimeIntervalId !== 0) {
      clearInterval(this.sectionTimeIntervalId);
    }
    this.sectionTimeIntervalId = setInterval(this.sectionTimerHandler, 1000);
    this.setState({ timer: 0 });
  };

  sectionTimerHandler = () => {
    this.setState((prevState) => {
      return {
        timer: prevState.timer + 1,
      };
    });
  };

  /** *********** */

  selectedAnswer = (e) => {
    const { question } = this.state;
    console.log(question);
    this.setState({ answer: e });
    const focusedQuestions = question;
    focusedQuestions.option_array = question.option_array.map((elem) => {
      if (elem.order === Number(e)) {
        elem.isFocus = true;
        return elem;
      }
      elem.isFocus = false;
      return elem;
    });
    this.setState({ question: focusedQuestions });
  };

  submitAnswer = (e) => {
    console.log();
    const { question, answer, timer, checked } = this.state;
    const { onSaveAndNext } = this.props;
    if (e === 'Clear Response') {
      if (question.question_type === 'single') {
        const focusedQuestions = question;
        focusedQuestions.option_array.forEach((res) => (res.isFocus = false));
        console.log(focusedQuestions, 'etf');
        this.setState({ question: focusedQuestions });
      } else if (question.question_type === 'subjective') {
        this.setState({ answer: '' });
      } else if (question.question_type === 'multiple') {
        const checkedFalse = checked.map(() => {
          return false;
        });
        this.setState({ checked: checkedFalse });
      }
    } else if (e === 'Save And Next' || e === 'Mark For Review') {
      if (e === 'Mark For Review') {
        this.setState({ review: true });
      }
      const correctQuestion = JSON.parse(JSON.stringify(question));
      correctQuestion.option_array = question.option_array.filter((elem) => {
        return elem.isFocus === true;
      });

      if (question.question_type === 'single') {
        const payload = {
          isCorrect:
            correctQuestion.option_array.length > 0 ? this.checkAnswer(correctQuestion) : null,
          answer:
            correctQuestion.option_array.length > 0 // converts order into a b c d and if empty sends null
              ? correctQuestion.option_array[0].order === 1
                ? '[A]'
                : correctQuestion.option_array[0].order === 2
                ? '[B]'
                : correctQuestion.option_array[0].order === 3
                ? '[C]'
                : '[D]'
              : null,
          uuid: correctQuestion.uuid,
          time: timer,
        };
        onSaveAndNext(payload, e);
      } else if (question.question_type === 'subjective') {
        const payload = {
          isCorrect:
            question.question_answer.toUpperCase().localeCompare(answer.toUpperCase()) === 0,
          answer: answer === '' ? null : answer,
          uuid: question.uuid,
          time: timer,
        };

        onSaveAndNext(payload, e);
      } else if (question.question_type === 'multiple') {
        console.log('multi');
        const convertToText = checked
          .map((elem, index) => {
            if (index === 0 && elem === true) return 'A';
            if (index === 1 && elem === true) return 'B';
            if (index === 2 && elem === true) return 'C';
            if (index === 3 && elem === true) return 'D';
            return null;
          })
          .filter((elem) => {
            return elem !== null;
          });
        // .reduce((cur, acc) => {
        //   return `${cur},${acc}`;
        // });
        const answerArray = question.question_answer
          .toUpperCase()
          .split('')
          .filter((elem) => {
            return elem !== '[' && elem !== ']' && elem !== ',';
          })
          .sort();

        const isCorrect =
          convertToText.length === answerArray.length &&
          convertToText.every((value, index) => value === answerArray[index]);

        console.log(convertToText, answerArray, isCorrect);
        const payload = {
          isCorrect,
          answer: convertToText.length > 0 ? convertToText : null,
          uuid: question.uuid,
          time: timer,
        };
        onSaveAndNext(payload, e);
      }
    }
  };

  checkAnswer = (elem) => {
    if (elem.question_type === 'single') {
      if (elem.option_array[0].order === 1 && elem.question_answer === '[A]') return true;
      if (elem.option_array[0].order === 2 && elem.question_answer === '[B]') return true;
      if (elem.option_array[0].order === 3 && elem.question_answer === '[C]') return true;
      if (elem.option_array[0].order === 4 && elem.question_answer === '[D]') return true;

      return false;
    }
    return null;
  };

  handleChecked(order) {
    const { checked } = this.state;
    const checkedArray = [...checked];
    checkedArray[order - 1] = !checkedArray[order - 1];
    this.setState({ checked: checkedArray });
    console.log('CHANGE!');
  }

  render() {
    const { question, answer, checked, timer } = this.state;
    return (
      <>
        <Card
          className='mx-2 mt-4 mb-2 p-2'
          style={{ boxShadow: '0px 1px 3px 0px rgba(0,0,0,0.16)', borderRadius: '10px' }}
        >
          <span className='ml-auto QuestionTaker__questionType my-2'>
            {question.question_type === 'single'
              ? 'Single Choice'
              : question.question_type === 'multiple'
              ? 'Multiple Choice'
              : 'Subjective'}
          </span>
          <div className='QuestionTaker__questionHeading'>
            <MathJax math={String.raw`${question.question_text}`} />
          </div>
          {question.question_image && (
            <img src={question.question_image} alt='question' className='img-fluid m-2' />
          )}
          <div className='mt-4'>
            {Object.keys(question).length > 0 &&
              question.option_array.length > 0 &&
              question.question_type === 'single' &&
              question.option_array.map((elem, i) => {
                return (
                  <div key={elem.order} className='QuestionTaker__questionOptions m-2 d-flex'>
                    <span className='my-auto mr-1'>
                      {i === 0 ? 'A.' : i === 1 ? 'B.' : i === 2 ? 'C.' : 'D.'}
                    </span>
                    <label
                      className={`QuestionTaker__customRadio p-2 w-100 ${
                        elem.isFocus ? 'QuestionTaker__focusedRadio' : 'w-75'
                      }`}
                      htmlFor={`testRadio${elem.order}`}
                    >
                      <input
                        type='radio'
                        name='testRadio'
                        value={elem.order}
                        onChange={(e) => this.selectedAnswer(e.target.value)}
                        onClick={(e) => this.selectedAnswer(e.target.value)}
                        id={`testRadio${elem.order}`}
                      />
                      <div className='radioControl'>
                        <MathJax math={String.raw`${elem.option_text_array[0]}`} />
                      </div>
                    </label>
                    {elem.image && <img src={elem.image} alt='option' className='img-fluid m-2' />}
                  </div>
                );
              })}

            {Object.keys(question).length > 0 && question.question_type === 'subjective' && (
              <div className='m-3'>
                <label className='has-float-label my-auto'>
                  <input
                    className='form-control'
                    name='Answer'
                    type='text'
                    placeholder='Answer'
                    value={question.student_answer ? question.student_answer : ''}
                    onChange={(e) => {
                      const newQuestion = question;
                      newQuestion.student_answer = e.target.value;
                      this.setState({ answer: e.target.value, question: newQuestion });
                    }}
                  />
                  <span>Answer</span>
                </label>
              </div>
            )}

            {Object.keys(question).length > 0 &&
              question.option_array.length > 0 &&
              question.question_type === 'multiple' &&
              question.option_array.map((elem, i) => {
                return (
                  <div key={elem.order} className='QuestionTaker__questionOptions d-flex m-2'>
                    <span className='my-auto mr-1'>
                      {i === 0 ? 'A.' : i === 1 ? 'B.' : i === 2 ? 'C.' : 'D.'}
                    </span>

                    <label
                      htmlFor={elem.order}
                      className={`QuestionTaker__customRadio p-2 w-100 ${
                        checked[elem.order - 1] ? 'QuestionTaker__focusedRadio' : 'w-75'
                      }`}
                    >
                      <div className='radioControl'>
                        <MathJax math={String.raw`${elem.option_text_array[0]}`} />
                      </div>
                      <input
                        onChange={() => this.handleChecked(elem.order)}
                        id={elem.order}
                        type=''
                        checked={checked[elem.order - 1]}
                      />
                      {elem.image && <img src={elem.image} alt='option' className='img-fluid' />}
                    </label>
                  </div>
                );
              })}
          </div>
        </Card>
        <Row className='mx-2 mt-5 mb-3 justify-content-center'>
          {['Clear Response', 'Save And Next', 'Mark For Review'].map((e) => {
            return (
              <Button variant='customTestSubmit' onClick={() => this.submitAnswer(e)} key={e}>
                {e}
              </Button>
            );
          })}
        </Row>
        {/* <pre>{timer}</pre> */}
      </>
    );
  }
}

export default QuestionCard;

QuestionCard.propTypes = {
  currentQuestion: PropTypes.instanceOf(Object).isRequired,
  onUnmount: PropTypes.func.isRequired,
  onSaveAndNext: PropTypes.func.isRequired,
};
