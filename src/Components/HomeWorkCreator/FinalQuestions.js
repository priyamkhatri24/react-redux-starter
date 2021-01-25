import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import MathJax from 'react-mathjax-preview';
import Button from 'react-bootstrap/Button';
import { connect } from 'react-redux';
import { getSelectedQuestionArray } from '../../redux/reducers/homeworkCreator.reducer';
import { PageHeader } from '../Common';

const PreviewQuestions = (props) => {
  const { selectedQuestionArray, history } = props;
  const [selectedQuestions, setSelectedQuestions] = useState([]);

  useEffect(() => {
    setSelectedQuestions(selectedQuestionArray);
  }, [selectedQuestionArray]);

  const goToAssigner = () => {
    history.push('/homework/assign');
  };

  return (
    <>
      <PageHeader title='Homework' />
      <Card className='Homework__selectCard mx-2' style={{ marginTop: '5rem' }}>
        {selectedQuestions.map((question, index) => {
          return (
            <Card className='m-1' key={question.question_id}>
              {Object.keys(question).length > 0 && (
                <>
                  <Row className=' ml-2 mr-0 mt-2'>
                    <span className='Homework__questionIndex'>
                      Q {index + 1 < 10 ? `0${index + 1}` : index + 1}
                    </span>
                    <div className='ml-auto d-flex'>
                      <span className='Homework__questionType my-auto mr-2'>
                        Type:
                        {question.question_type === 'single'
                          ? 'MCQ'
                          : question.question_type === 'multiple'
                          ? 'Multiple Choice'
                          : 'Subjective'}
                      </span>
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
                </>
              )}
            </Card>
          );
        })}
      </Card>
      {!history.location.state && !history.location.state.goTo === 'addContent' && (
        <Row className='justify-content-center my-3' onClick={() => goToAssigner()}>
          <Button variant='customPrimary'>Next</Button>
        </Row>
      )}
    </>
  );
};

const mapStateToProps = (state) => ({
  selectedQuestionArray: getSelectedQuestionArray(state),
});

export default connect(mapStateToProps)(PreviewQuestions);

PreviewQuestions.propTypes = {
  selectedQuestionArray: PropTypes.instanceOf(Array).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
    location: PropTypes.shape({
      state: PropTypes.shape({
        goTo: PropTypes.string.isRequired,
      }),
    }),
  }).isRequired,
};
