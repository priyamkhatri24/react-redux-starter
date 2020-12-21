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

const Question = (props) => {
  const { question, index, update } = props;

  const addtoSelected = () => {
    question.isSelected = !question.isSelected;
    update(question);
  };

  return (
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
            <MathJax math={String.raw`${question.question_text}`} />
          </div>

          {question.question_type !== 'subjective' && (
            <p className='Homework__options text-left m-2'>Options</p>
          )}

          {question.question_type !== 'subjective' &&
            question.option_array.map((e, i) => {
              return (
                <div className='d-flex mx-3 mb-2 Homework__multipleOptions' key={e.order}>
                  <span className='mr-2 my-auto'>{i + 1}.</span>{' '}
                  <MathJax math={String.raw`${e.text}`} />
                </div>
              );
            })}

          {question.question_solution_text && (
            <p className='Homework__options text-left m-2'>Solution:</p>
          )}
          <div className='d-flex mx-3 mb-2 Homework__multipleOptions text-left'>
            <MathJax math={String.raw`${question.question_solution_text}`} />
          </div>
          <hr />
          <Row className='m-1 mb-3'>
            <Button variant='reportProblem'>
              <ReportIcon /> Report
            </Button>
            <div className='ml-auto'>
              <Button variant='homeworkAdd' onClick={() => addtoSelected()}>
                {question.isSelected ? <RemoveIcon /> : <AddIcon />}
              </Button>
              <Button variant='homeworkAddToPaper' onClick={() => addtoSelected()}>
                {question.isSelected ? 'Remove' : 'Add To Paper'}
              </Button>
            </div>
          </Row>
        </>
      )}
    </Card>
  );
};

export default Question;

Question.propTypes = {
  question: PropTypes.instanceOf(Object).isRequired,
  index: PropTypes.number.isRequired,
  update: PropTypes.func.isRequired,
};
