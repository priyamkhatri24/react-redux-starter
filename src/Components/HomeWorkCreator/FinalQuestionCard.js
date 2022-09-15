import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import MathJax from 'react-mathjax-preview';
import Card from 'react-bootstrap/Card';

const FinalQuestionCard = (props) => {
  const {
    question,
    index,
    updateQuestionMarks,
    showMarks,
    sectionName,
    isViewOnly,
    isAnalysis,
    language,
  } = props;
  const [imgLink, setImgLink] = useState('');
  const [showImageModal, setShowImageModal] = useState(false);
  const handleImageClose = () => setShowImageModal(false);
  const handleImageOpen = () => setShowImageModal(true);
  // const [question, setQuestion] = useState({});

  // useEffect(() => {
  //   if (language === 'hindi') {
  //     const questionn = { ...ques };
  //     questionn.question_text = questionn.hindi_text;
  //     questionn.question_solution_text = questionn.hindi_solution_text;
  //     questionn.option_array = questionn.hindi_option_array;
  //     setQuestion(questionn);
  //   } else {
  //     setQuestion(question);
  //   }
  //   console.log(question);
  // }, [ques]);
  console.log(question, 'questionCard ke under');
  return (
    <Card className='m-1' key={question.question_id}>
      {Object.keys(question).length > 0 && (
        <>
          <Row className=' ml-2 mr-0 mt-2'>
            <span className='Homework__questionIndex'>
              Question .{index + 1 < 10 ? `0${index + 1}` : index + 1} ({' '}
              <span style={{ color: 'lightGreen' }}>
                +{Number(question.question_positive_marks).toFixed(2)}
              </span>
              ,
              <span style={{ color: 'red' }}>
                -{Number(question.question_negative_marks).toFixed(2)}
              </span>
              )
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
            <span style={{ lineHeight: '25px' }}>
              {(language === 'english' || language === 'both' || !language) && (
                <MathJax math={String.raw`${question.question_text}`} />
              )}
            </span>
            <span style={{ lineHeight: '30px' }} className='mt-1'>
              {(language === 'hindi' || language === 'both') && (
                <MathJax math={String.raw`${question.hindi_text}`} />
              )}
            </span>
          </div>
          {question.question_image && (
            <div
              style={{ width: '93%', margin: 'auto' }}
              role='button'
              tabIndex={-1}
              onKeyPress={() => {
                setImgLink(question.question_image);
                handleImageOpen();
              }}
              onClick={() => {
                setImgLink(question.question_image);
                handleImageOpen();
              }}
            >
              <img
                src={question.question_image}
                className='img-fluid m-2 mx-auto finalQuestionImageClass'
                alt='question'
              />
            </div>
          )}

          {question.question_type !== 'subjective' && (
            <p className='Homework__options text-left m-2'>Options</p>
          )}

          {question.question_type !== 'subjective' &&
            (language === 'english' || language === 'both' || !language) &&
            question.option_array.map((e, i) => {
              return (
                <Row className='d-flex mx-3 mb-2 Homework__multipleOptions' key={e.order}>
                  <span className='mr-2 my-auto'>{i + 1}.</span>{' '}
                  <MathJax math={String.raw`${e.text}`} />
                  {e.image && (
                    <div
                      role='button'
                      tabIndex={-1}
                      onKeyPress={() => {
                        setImgLink(e.image);
                        handleImageOpen();
                      }}
                      onClick={() => {
                        setImgLink(e.image);
                        handleImageOpen();
                      }}
                    >
                      <img
                        src={e.image}
                        className='img-fluid finalQuestionImageClass'
                        alt='option'
                      />
                    </div>
                  )}
                </Row>
              );
            })}

          {question.question_type !== 'subjective' &&
            (language === 'hindi' || language === 'both') &&
            question.hindi_option_array.map((e, i) => {
              return (
                <Row className='d-flex mx-3 mb-2 Homework__multipleOptions' key={e.order}>
                  <span className='mr-2 my-auto'>{i + 1}.</span>{' '}
                  <MathJax math={String.raw`${e.text}`} />
                  {e.image && (
                    <div
                      role='button'
                      tabIndex={-1}
                      onKeyPress={() => {
                        setImgLink(e.image);
                        handleImageOpen();
                      }}
                      onClick={() => {
                        setImgLink(e.image);
                        handleImageOpen();
                      }}
                    >
                      <img
                        src={e.image}
                        className='img-fluid finalQuestionImageClass'
                        alt='option'
                      />
                    </div>
                  )}
                </Row>
              );
            })}

          {question.question_answer && (
            <p className='Homework__options text-left m-2'>Correct answer:</p>
          )}
          <div className='d-flex mx-3 mb-2 Homework__multipleOptions text-left'>
            <MathJax math={String.raw`${question.question_answer}`} />
          </div>

          {language !== 'hindi' && question.question_solution_text && (
            <>
              <p className='Homework__options text-left m-2'>Solution:</p>
              <div className='d-flex mx-3 mb-2 Homework__multipleOptions soultion text-left'>
                <MathJax math={String.raw`${question.question_solution_text}`} />
              </div>
            </>
          )}
          {language === 'hindi' && question.hindi_solution_text && (
            <>
              <p className='Homework__options text-left m-2'>Solution:</p>
              <div className='d-flex mx-3 mb-2 Homework__multipleOptions soultion text-left'>
                <MathJax math={String.raw`${question.hindi_solution_text}`} />
              </div>
            </>
          )}

          {question.question_solution_image && (
            <>
              <p className='Homework__options text-left m-2'>Solution:</p>
              <div
                className='d-flex mx-3 mb-2 Homework__multipleOptions soultionImage text-left'
                role='button'
                tabIndex={-1}
                onKeyPress={() => {
                  setImgLink(question.question_solution_image);
                  handleImageOpen();
                }}
                onClick={() => {
                  setImgLink(question.question_solution_image);
                  handleImageOpen();
                }}
              >
                <img
                  src={question.question_solution_image}
                  className='img-fluid m-2 w-75 mx-auto'
                  alt='question'
                />
              </div>
            </>
          )}

          {isAnalysis && (
            <>
              <p className='Homework__options text-left m-2'>
                {question.question_type !== 'subjective' ? 'Option Marked:' : 'Answer'}
              </p>
              <div className='d-flex mx-3 mb-2 Homework__multipleOptions text-left'>
                {question.student_answer === 'E' ? (
                  'Unanswered'
                ) : (
                  <MathJax math={String.raw`${question.student_answer}`} />
                )}
              </div>
              <p className='Homework__options text-left m-2'>
                Time Taken: {Math.floor(question.time_taken / 60000)} minutes{' '}
                {(question.time_taken / 1000) % 60} seconds
              </p>
            </>
          )}
        </>
      )}
      {!isViewOnly && (
        <Row className='mx-0' style={showMarks ? {} : { pointerEvents: 'none', opacity: '0.4' }}>
          {[
            {
              id: 1,
              name: 'Correct',
              value: question.question_positive_marks,
              color: 'rgba(0, 151, 0, 1)',
            },
            {
              id: 2,
              name: 'Incorrect',
              value: question.question_negative_marks,
              color: 'rgba(255, 0, 0, 1)',
            },
            {
              id: 3,
              name: 'Unanswered',
              value: question.question_unanswered_marks,
              color: 'rgba(86, 66, 61, 1)',
            },
          ].map((elem) => {
            return (
              <Col xs={4} className='text-center' key={elem.id}>
                <label
                  className='has-float-label my-3 mx-1 '
                  style={{ fontSize: '10px', color: elem.color }}
                >
                  <input
                    className='form-control'
                    name={elem.name}
                    type='number'
                    placeholder={elem.name}
                    value={elem.value}
                    onChange={(e) =>
                      updateQuestionMarks(
                        question.question_id,
                        elem.name,
                        e.target.value,
                        sectionName,
                      )
                    } //eslint-disable-line
                    style={{ borderColor: elem.color }}
                  />
                  <span style={{ color: elem.color }}>{elem.name}</span>
                </label>
              </Col>
            );
          })}
        </Row>
      )}

      <Modal show={showImageModal} onHide={handleImageClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Image Modal</Modal.Title>
        </Modal.Header>
        <Modal.Body className='mx-auto d-flex justify-content-center'>
          <img src={imgLink} alt='img' className='img-fluid' />
        </Modal.Body>
      </Modal>
    </Card>
  );
};

export default FinalQuestionCard;

FinalQuestionCard.propTypes = {
  question: PropTypes.instanceOf(Object).isRequired,
  index: PropTypes.number.isRequired,
  updateQuestionMarks: PropTypes.func,
  showMarks: PropTypes.bool.isRequired,
  sectionName: PropTypes.string,
  isViewOnly: PropTypes.bool,
  isAnalysis: PropTypes.bool,
  language: PropTypes.string,
};

FinalQuestionCard.defaultProps = {
  sectionName: '',
  updateQuestionMarks: () => {},
  isViewOnly: false,
  isAnalysis: false,
  language: 'english',
};
