import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Collapse from 'react-bootstrap/Collapse';
import DoneIcon from '@material-ui/icons/Done';

const Pallette = (props) => {
  const { questions, changeQuestion } = props;
  const [currentQuestion, setCurrentQuestion] = useState(55);
  const [totalQuestions, setTotalQuestions] = useState([]);
  const [subject, setSubject] = useState('');
  const [expand, setExpand] = useState(false);

  useEffect(() => {
    if (questions) {
      //  setSubject(questions[0].subject);
      //  setTotalQuestions(questions[0].question_list);
      setCurrentQuestion(1);
    }

    console.log(questions, 'pallle');
  }, [questions]);

  useEffect(() => {
    if (questions) {
      setSubject(questions[0].subject);
      setTotalQuestions(questions[0].question_list);
      setCurrentQuestion(1);
    }
  }, []);

  const selectSubject = (elem) => {
    setSubject(elem.subject);
    setTotalQuestions(elem.question_list);
    changeQuestion(elem.subject, 1);
    setCurrentQuestion(1);
  };

  const handleChangeQuestion = (id) => {
    setCurrentQuestion(id);
    changeQuestion(subject, id);
  };

  return (
    <div className='mt-3 mx-2'>
      <Card style={{ boxShadow: '0px 1px 3px 0px rgba(0,0,0,0.16)', borderRadius: '10px' }}>
        <Row className='mx-2 my-3'>
          <Col xs={10}>
            <Row>
              <span className='QuestionTaker__smallQuestion my-auto'>Question</span>
              <span className='QuestionTaker__currentQuestion ml-2'>{currentQuestion}</span>
              <span className='QuestionTaker__totalQuestions ml-1'>/{totalQuestions.length}</span>
              <span className='ml-auto QuestionTaker__currentSubject'>{subject}</span>
            </Row>
            <Row>
              <ProgressBar
                now={(currentQuestion / totalQuestions.length) * 100}
                variant='testProgress'
                bsPrefix='testerProgressBar'
              />
            </Row>
          </Col>
          <Col xs={2}>
            {expand ? (
              <span
                onClick={() => setExpand(!expand)}
                role='button'
                tabIndex='-1'
                onKeyDown={() => setExpand(!expand)}
              >
                <ExpandLessIcon className='m-auto' />
              </span>
            ) : (
              <span
                onClick={() => setExpand(!expand)}
                role='button'
                tabIndex='-1'
                onKeyDown={() => setExpand(!expand)}
              >
                <ExpandMoreIcon className='m-auto' />
              </span>
            )}
          </Col>
        </Row>
        <Collapse in={expand}>
          <div style={{ backgroundColor: 'rgba(241, 249, 255, 1)' }}>
            <p className='QuestionTaker__smallQuestion m-2'>Sections</p>
            <Row className='m-2'>
              {questions
                ? questions.map((elem) => {
                    return (
                      <Button
                        variant='testBlueOnWhite'
                        active={elem.subject === subject}
                        key={elem.subject}
                        onClick={() => selectSubject(elem)}
                      >
                        {elem.subject}
                      </Button>
                    );
                  })
                : ''}
            </Row>
            <p className='QuestionTaker__smallQuestion m-2'>Question Pallette</p>
            <Row className='m-2'>
              {totalQuestions.map((elem) => {
                return (
                  <Button
                    variant='testPallette'
                    className={
                      elem.question_status === 'attempted'
                        ? 'btn-greenTest'
                        : elem.question_status === 'review'
                        ? 'btn-purpleTest'
                        : elem.question_status === 'reviewAttempted'
                        ? 'btn-purpleGreenTest'
                        : elem.question_status === 'unattempted'
                        ? 'btn-redTest'
                        : 'btn-unattempted'
                    }
                    onClick={() => handleChangeQuestion(elem.uuid)}
                    key={elem.uuid}
                  >
                    {elem.question_status === 'reviewAttempted' && (
                      <DoneIcon className='QuestionTaker__tick' id='testTick' />
                    )}
                    {elem.uuid}
                  </Button>
                );
              })}
            </Row>
          </div>
        </Collapse>
      </Card>
    </div>
  );
};

export default Pallette;

Pallette.propTypes = {
  questions: PropTypes.instanceOf(Array).isRequired,
};
