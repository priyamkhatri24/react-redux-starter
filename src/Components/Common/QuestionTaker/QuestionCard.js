import React, { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import MathJax from 'react-mathjax-preview';
import cx from 'classnames';
import { propComparator, useInterval } from '../../../Utilities';

const QuestionCard = (props) => {
  const { currentQuestion, onUnmount } = props;
  const [question, setQuestion] = useState({});
  const [timer, setTimer] = useState(0);
  const [answer, setAnswer] = useState('');

  useEffect(() => {
    if (Object.keys(currentQuestion).length > 0) {
      currentQuestion.option_array.sort(propComparator('order'));
      setQuestion(currentQuestion);
      setTimer(currentQuestion.timer);
    }

    console.log(answer, 'ye answer h');
  }, [currentQuestion, answer]);

  useEffect(() => {
    return () =>
      onUnmount({
        time: timer,
        count: currentQuestion.noOfTimesVisited + 1,
        uuid: currentQuestion.uuid,
      });
  }, []);

  useInterval(() => {
    setTimer(timer + 1);
  }, 1000);

  const selectedAnswer = (e) => {
    setAnswer(e);
    const focusedQuestions = question;
    focusedQuestions.option_array = question.option_array.map((elem) => {
      if (elem.order === Number(e)) {
        elem.isFocus = true;
        return elem;
      }
      elem.isFocus = false;
      return elem;
    });
    setQuestion(focusedQuestions);
  };

  const submitAnswer = (e) => {
    console.log(question, 'yessyr');
    if (e === 'Clear Response') {
      const focusedQuestions = question;
      focusedQuestions.option_array.forEach((res) => (res.isFocus = false));
      console.log(focusedQuestions, 'etf');
      setQuestion(focusedQuestions);
    } else if (e === 'Save And Next') {
      const correctQuestion = question;
      correctQuestion.option_array = question.option_array.filter((elem) => {
        return elem.isFocused === true;
      });

      console.log(correctQuestion, 'shi h ye');
    }
  };

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
        <div className='mt-4'>
          {Object.keys(question).length > 0 &&
            question.option_array.length > 0 &&
            question.question_type === 'single' &&
            question.option_array.map((elem) => {
              return (
                <div key={elem.order} className='QuestionTaker__questionOptions m-2'>
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
                      onChange={(e) => selectedAnswer(e.target.value)}
                      id={`testRadio${elem.order}`}
                    />
                    <div className='radioControl'>
                      <MathJax math={String.raw`${elem.option_text_array[0]}`} />
                    </div>
                  </label>
                </div>
              );
            })}
        </div>
      </Card>
      <Row className='mx-2 mt-5 mb-3 justify-content-center'>
        {['Clear Response', 'Save And Next', 'Mark For Review'].map((e) => {
          return (
            <Button variant='customTestSubmit' onClick={() => submitAnswer(e)} key={e}>
              {e}
            </Button>
          );
        })}
      </Row>
      <pre>{timer}</pre>
    </>
  );
};

export default QuestionCard;
