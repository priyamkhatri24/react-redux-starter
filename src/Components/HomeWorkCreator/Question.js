import React from 'react';
import PropTypes from 'prop-types';
import Row from 'react-bootstrap/Row';
import CreateIcon from '@material-ui/icons/Create';
import Button from 'react-bootstrap/Button';
import MathJax from 'react-mathjax-preview';
import Card from 'react-bootstrap/Card';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import ReportIcon from '@material-ui/icons/Report';
import './HomeWorkCreator.scss';

const Question = (props) => {
  const { question, index, update, language } = props;

  const addtoSelected = () => {
    console.log(question, 'quesssssss');
    question.isSelected = !question.isSelected;
    update(question);
  };

  // useEffect(() => {
  //   console.log(language);
  //   if (language === 'hindi') {
  //     const ques = { ...question };
  //     console.log(ques, 'quessbeforeee');
  //     ques.question_text = ques.hindi_text;
  //     ques.question_solution_text = ques.hindi_solution_text;
  //     ques.option_array = ques.hindi_option_array;
  //     console.log(ques, 'afterrrr');
  //     console.log(question, 'orignalQuestionnnnn');
  //     setQuestionFinal(ques);
  //   } else {
  //     setQuestionFinal(question);
  //   }
  //   console.log(questionFinal);
  // }, [question]);

  console.log(question, 'question testing for images');

  return (
    <>
      <Card className='m-1'>
        {Object.keys(question).length > 0 && (
          <>
            <Row className=' ml-2 mr-0 mt-2'>
              <span className='Homework__questionIndex'>Q {index < 10 ? `0${index}` : index}</span>
              <div className='ml-auto d-flex'>
                <span className='Homework__questionType my-auto mr-2'>
                  Type:
                  {question.question_type === 'single'
                    ? 'MCQ'
                    : question.question_type === 'multiple'
                    ? 'Multiple Choice'
                    : 'Subjective'}
                </span>
                <div
                  className='Homework__edit text-center p-0'
                  onClick={() => {}}
                  role='button'
                  onKeyDown={() => {}}
                  tabIndex='-1'
                >
                  <CreateIcon style={{ fontSize: '16px', color: 'rgba(0, 0, 0, 0.38)' }} />
                </div>
              </div>
            </Row>

            <div className='Homework__questionHeading text-left m-2'>
              <MathJax
                math={String.raw`${
                  language === 'hindi' ? question.hindi_text : question.question_text
                }`}
              />
              {question.question_image && (
                <div className=' mt-2 Homework__questionImgContainer text-left'>
                  <img
                    src={question.question_image}
                    alt='question'
                    className='img-fluid m-2'
                  />
                </div>
              )}
            </div>

            {question.question_type !== 'subjective' && (
              <p className='Homework__options text-left m-2'>Options</p>
            )}

            {question.question_type !== 'subjective' &&
              (language === 'hindi'
                ? question.hindi_option_array
                : question.option_array
                ? question.option_array
                : []
              ).map((e, i) => {
                return (
                  <>
                    <div className='d-flex mx-3 mb-2 Homework__multipleOptions' key={e.order}>
                      <span className='mr-2 my-auto'>{String.fromCharCode(i + 65)}.</span>{' '}
                      <MathJax math={String.raw`${e.text}`} />
                    </div>
                    {e.image && (
                      <div>
                        <img
                          src={e.image}
                          alt='option'
                          className='img-fluid m-2'
                        />
                      </div>
                    )}
                  </>
                );
              })}

            {question.question_answer && <p className='Homework__options text-left m-2'>Answer:</p>}
            <div className='d-flex mx-3 mb-2 Homework__multipleOptions text-left'>
              <MathJax math={String.raw`${question.question_answer}`} />
            </div>
            <hr />
            <Row className='m-1 mb-3'>
              <Button variant='reportProblem'>
                <ReportIcon /> Report
              </Button>
              <div className='ml-auto'>
                {question.isSelected ? (
                  <Button variant='homeworkAddred' onClick={() => addtoSelected()}>
                    <RemoveIcon />
                  </Button>
                ) : null}
                {!question.isSelected ? (
                  <Button variant='homeworkAdd' onClick={() => addtoSelected()}>
                    <AddIcon />
                  </Button>
                ) : null}
                {question.isSelected ? (
                  <Button variant='homeworkAddToPaperred' onClick={() => addtoSelected()}>
                    Remove
                  </Button>
                ) : null}
                {!question.isSelected ? (
                  <Button variant='homeworkAddToPaper' onClick={() => addtoSelected()}>
                    Add To Paper
                  </Button>
                ) : null}
              </div>
            </Row>
          </>
        )}
      </Card>
    </>
  );
};

export default Question;

Question.propTypes = {
  question: PropTypes.instanceOf(Object).isRequired,
  index: PropTypes.number.isRequired,
  update: PropTypes.func.isRequired,
  language: PropTypes.string.isRequired,
};
