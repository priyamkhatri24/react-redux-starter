import React, { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import { propComparator } from '../../../Utilities';

const QuestionCard = (props) => {
  const { currentQuestion } = props;
  const [question, setQuestion] = useState({});
  const [timer, setTimer] = useState(0);
  const [answer, setAnswer] = useState('');
  const [isFocused, setFocused] = useState();

  useEffect(() => {
    currentQuestion.option_array.sort(propComparator('order'));
    setQuestion(currentQuestion);
    console.log(answer, 'ye answer h');
  }, [currentQuestion, answer]);

  const selectedAnswer = (e) => {
    setAnswer(e);
    const focusedQuestions = question;
    focusedQuestions.option_array = question.option_array.map((elem) => {
      if (elem.order === Number(e)) {
        elem.isFocused = true;
        return elem;
      }
      elem.isFocused = false;
      return elem;
    });
    setQuestion(focusedQuestions);
  };

  const submitAnswer = (elem) => {
    console.log(question);
    if (elem === 'Clear Response') {
      const focusedQuestions = question;
      focusedQuestions.option_array = question.option_array.map((e) => {
        e.isFocused = false;
        return e;
      });
      console.log(focusedQuestions);
      setQuestion(focusedQuestions);
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
            ? 'Multiple Choice'
            : question.question_type === 'multiple'
            ? 'Multiple Choice'
            : 'Subjective'}
        </span>
        <div
          className='QuestionTaker__questionHeading'
          dangerouslySetInnerHTML={{ __html: question.question_text }}
        />
        <div className='mt-4'>
          {Object.keys(question).length > 0 &&
            question.option_array.length > 0 &&
            question.question_type === 'single' &&
            question.option_array.map((elem) => {
              return (
                <div key={elem.order} className='QuestionTaker__questionOptions m-2'>
                  <label
                    className={`QuestionTaker__customRadio p-2 ${
                      elem.isFocused ? 'QuestionTaker__focusedRadio' : ''
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
                    <div
                      className='radioControl'
                      dangerouslySetInnerHTML={{ __html: elem.option_text_array[0] }}
                    />
                  </label>
                </div>
              );
            })}
        </div>
      </Card>
      <Row className='mx-2 mt-5 mb-3 justify-content-center'>
        {['Clear Response', 'Save And Next', 'Mark For Review'].map((elem) => {
          return (
            <Button variant='customTestSubmit' onClick={() => submitAnswer(elem)}>
              {elem}
            </Button>
          );
        })}
      </Row>
    </>
  );
};

export default QuestionCard;
