import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
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
      currentLanguage: 'english',
      imgLink: '',
      showImageModal: false,
    };
    this.optionImageRef = React.createRef();
    this.questionImageRef = React.createRef();
  }

  componentDidMount() {
    const { currentQuestion, language } = this.props;
    console.log(currentQuestion);
    if (Object.keys(currentQuestion).length > 0) {
      currentQuestion.option_array.sort(propComparator('order'));

      this.setState({
        question: currentQuestion,
        timer: currentQuestion.timer,
        currentLanguage: language,
      });
    }
  }

  componentDidUpdate(prevProps) {
    const { currentQuestion, onUnmount, language } = this.props;
    const { timer, question, review, currentLanguage } = this.state;

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

    if (prevProps.language !== currentLanguage) {
      this.setState({ currentLanguage: language });
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

  handleImageClose = () => {
    this.setState({ showImageModal: false });
  };

  handleImageOpen = () => {
    this.setState({ showImageModal: true });
  };

  /** ********Timer logic***** */
  handleChecked(order) {
    const { checked } = this.state;
    const checkedArray = checked.length === 0 ? [false, false, false, false] : [...checked];

    checkedArray[order - 1] = !checkedArray[order - 1];
    this.setState({ checked: checkedArray });
    console.log(checkedArray);
    console.log('CHANGE!');
  }

  restartSectionTimer = () => {
    if (this.sectionTimeIntervalId !== 0) {
      clearInterval(this.sectionTimeIntervalId);
    }
    this.sectionTimeIntervalId = setInterval(this.sectionTimerHandler, 1000);
    this.setState({ timer: 0 });
  };

  multipleQuestionRender = (elem, i) => {
    const { checked } = this.state;
    return (
      <div key={elem.order} className='QuestionTaker__questionOptions d-flex m-2'>
        <span className='my-auto mr-1'>
          {i === 0
            ? 'A.'
            : i === 1
            ? 'B.'
            : i === 2
            ? 'C.'
            : i === 3
            ? 'D.'
            : i === 4
            ? 'E.'
            : 'F.'}
        </span>

        <div
          // htmlFor={`test${elem.order}`}
          className={`QuestionTaker__customRadio p-2 w-100 ${
            checked[elem.order - 1] ? 'QuestionTaker__focusedRadio' : 'w-75'
          }`}
          onClick={() => this.handleChecked(elem.order)}
          onKeyDown={() => this.handleChecked(elem.order)}
          role='button'
          tabIndex='-1'
        >
          <div className='radioControl'>
            <MathJax math={String.raw`${elem.text}`} />
            {/* {elem.text} */}
          </div>
          {/* <input
                        onChange={() => this.handleChecked(elem.order)}
                        id={`test${elem.order}`}
                        type=''
                        checked={checked[elem.order - 1]}
                      /> */}
          {elem.image && (
            <img
              src={elem.image}
              alt='option'
              className='img-fluid'
              style={{ width: '70%', height: 'auto' }}
            />
          )}
        </div>
      </div>
    );
  };

  singleQuestionRender = (elem, i) => {
    return (
      <div key={elem.order} className='QuestionTaker__questionOptions m-2 d-flex'>
        <span className='my-auto mr-1'>
          {i === 0
            ? 'A.'
            : i === 1
            ? 'B.'
            : i === 2
            ? 'C.'
            : i === 3
            ? 'D.'
            : i === 4
            ? 'E.'
            : 'F.'}
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
            <MathJax math={String.raw`${elem.text}`} />
          </div>
          {elem.image && (
            <img
              src={elem.image}
              alt='option'
              className='img-fluid m-2'
              ref={this.optionImageRef}
              style={{ maxWidth: '70%', height: 'auto' }}
            />
          )}
        </label>
      </div>
    );
  };

  checkAnswer = (elem) => {
    if (elem.question_type === 'single') {
      if (elem.option_array[0].order === 1 && elem.question_answer === '[A]') return true;
      if (elem.option_array[0].order === 2 && elem.question_answer === '[B]') return true;
      if (elem.option_array[0].order === 3 && elem.question_answer === '[C]') return true;
      if (elem.option_array[0].order === 4 && elem.question_answer === '[D]') return true;
      if (elem.option_array[0].order === 5 && elem.question_answer === '[E]') return true;
      if (elem.option_array[0].order === 6 && elem.question_answer === '[F]') return true;

      return false;
    }
    return null;
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
                : correctQuestion.option_array[0].order === 4
                ? '[D]'
                : correctQuestion.option_array[0].order === 5
                ? '[E]'
                : '[F]'
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
            if (index === 4 && elem === true) return 'E';
            if (index === 5 && elem === true) return 'F';
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

  selectedAnswer = (e) => {
    // option arrays must be the same always
    const { question, currentLanguage } = this.state;
    console.log(question);
    this.setState({ answer: e });
    const focusedQuestions = question;
    focusedQuestions.option_array =
      currentLanguage === 'english'
        ? question.option_array.map((elem) => {
            if (elem.order === Number(e)) {
              elem.isFocus = true;
              return elem;
            }
            elem.isFocus = false;
            return elem;
          })
        : question.hindi_option_array.map((elem) => {
            if (elem.order === Number(e)) {
              elem.isFocus = true;
              return elem;
            }
            elem.isFocus = false;
            return elem;
          });

    focusedQuestions.hindi_option_array =
      currentLanguage === 'english'
        ? question.option_array.map((elem) => {
            if (elem.order === Number(e)) {
              elem.isFocus = true;
              return elem;
            }
            elem.isFocus = false;
            return elem;
          })
        : question.hindi_option_array.map((elem) => {
            if (elem.order === Number(e)) {
              elem.isFocus = true;
              return elem;
            }
            elem.isFocus = false;
            return elem;
          });

    this.setState({ question: focusedQuestions });
  };

  sectionTimerHandler = () => {
    this.setState((prevState) => {
      return {
        timer: prevState.timer + 1,
      };
    });
  };

  /** *********** */

  render() {
    const { question, checked, currentLanguage, showImageModal, imgLink } = this.state;
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
          {currentLanguage === 'english' && (
            <div className='QuestionTaker__questionHeading cantSelect'>
              <MathJax math={String.raw`${question.question_text}`} />
            </div>
          )}
          {currentLanguage === 'hindi' && (
            <div className='QuestionTaker__questionHeading cantSelect'>
              <MathJax math={String.raw`${question.hindi_text}`} />
            </div>
          )}
          {question.question_image && (
            <div>
              <img
                src={question.question_image}
                alt='question'
                className='m-2'
                ref={this.questionImageRef}
                style={{ maxWidth: '80%', height: 'auto', maxHeight: '270px' }}
              />
            </div>
          )}
          <div className='mt-4'>
            {Object.keys(question).length > 0 &&
              question.option_array.length > 0 &&
              question.question_type === 'single' &&
              (currentLanguage === 'english'
                ? question.option_array.map(this.singleQuestionRender)
                : question.hindi_option_array.map(this.singleQuestionRender))}
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
                      {i === 0
                        ? 'A.'
                        : i === 1
                        ? 'B.'
                        : i === 2
                        ? 'C.'
                        : i === 3
                        ? 'D.'
                        : i === 4
                        ? 'E.'
                        : 'F.'}
                    </span>

                    <div
                      // htmlFor={`test${elem.order}`}
                      className={`QuestionTaker__customRadio p-2 w-100 ${
                        checked[elem.order - 1] ? 'QuestionTaker__focusedRadio' : 'w-75'
                      }`}
                      onClick={() => this.handleChecked(elem.order)}
                      onKeyDown={() => this.handleChecked(elem.order)}
                      role='button'
                      tabIndex='-1'
                    >
                      <div className='radioControl'>
                        <MathJax math={String.raw`${elem.text}`} />
                      </div>
                      {/* <input
                        onChange={() => this.handleChecked(elem.order)}
                        id={`test${elem.order}`}
                        type=''
                        checked={checked[elem.order - 1]}
                      /> */}
                      {elem.image && (
                        <img
                          src={elem.image}
                          alt='option'
                          className='img-fluid'
                          style={{ maxWidth: '70%', height: 'auto', maxHeight: '140px' }}
                        />
                      )}
                    </div>
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
        <Modal show={showImageModal} onHide={this.handleImageClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>Image Modal</Modal.Title>
          </Modal.Header>
          <Modal.Body className='mx-auto'>
            <img src={imgLink} alt='img' className='img-fluid' />
          </Modal.Body>
        </Modal>
      </>
    );
  }
}

export default QuestionCard;

QuestionCard.propTypes = {
  currentQuestion: PropTypes.instanceOf(Object).isRequired,
  onUnmount: PropTypes.func.isRequired,
  onSaveAndNext: PropTypes.func.isRequired,
  language: PropTypes.string.isRequired,
};
