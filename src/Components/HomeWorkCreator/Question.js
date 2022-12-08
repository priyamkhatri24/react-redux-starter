import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/Modal';
import CreateIcon from '@material-ui/icons/Create';
import Button from 'react-bootstrap/Button';
import MathJax from 'react-mathjax-preview';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import CancelIcon from '@material-ui/icons/Cancel';
import ReportIcon from '@material-ui/icons/Report';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import './HomeWorkCreator.scss';
import Swal from 'sweetalert2';
import { apiValidation, get, uploadImage } from '../../Utilities';

const Question = (props) => {
  const { question, index, update, language } = props;
  const [questionModal, setQuestionModal] = useState(false);
  const [questionText, setQuestionText] = useState(question.question_text);
  const [questionImage, setQuestionImage] = useState(question.question_image);
  const [solutionImage, setSolutionImage] = useState(question.question_solution_image);
  const [options, setOptions] = useState(question.option_array);
  console.log(question, 'q');
  const hideQuestionModal = () => setQuestionModal(false);

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

  const checkIfQuestionEditable = () => {
    const payload = {
      question_id: question.question_id,
      client_id: 3,
    };
    console.log(payload);
    get(payload, '/checkIfQuestionIsEditable').then((res) => {
      if (res.success) {
        console.log('open edit screen');
        setQuestionModal(true);
      } else {
        console.log('oops');
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: res.result,
        });
      }
    });
  };

  const getAttachment = (e, types) => {
    const file = e.target.files[0];
    uploadImage(file).then((res) => {
      console.log('fileu;lod ', res);
      console.log(types);
      if (types === 'question') {
        setQuestionImage(res.filename);
      } else setSolutionImage(res.filename);
    });
  };

  const updateOptionText = (optext, indx) => {
    const newOptions = [...options];
    newOptions[indx].text = optext;
    // console.log(newOptions, options);
    setOptions(newOptions);
  };

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
                {/* <div
                  className='Homework__edit text-center p-0'
                  onClick={() => checkIfQuestionEditable()}
                  role='button'
                  onKeyDown={() => checkIfQuestionEditable()}
                  tabIndex='-1'
                >
                  <CreateIcon style={{ fontSize: '16px', color: 'rgba(0, 0, 0, 0.38)' }} />
                </div> */}
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
                  <img src={question.question_image} alt='question' className='img-fluid m-2' />
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
                        <img src={e.image} alt='option' className='img-fluid m-2' />
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

      <Modal show={questionModal} onHide={hideQuestionModal} size='lg'>
        <Modal.Header>Edit Question</Modal.Header>
        <Modal.Body className='d-flex justify-content-center'>
          <div>
            <div className='d-flex questionUpperC my-2 mx-3'>
              <textarea
                onChange={(e) => {
                  // updateQuestion(e.target.value);
                  setQuestionText(e.target.value);
                }}
                placeholder='Question'
                className='questionTextarea'
                value={questionText}
              />
              <span className='Homework__ckAttach mt-1'>
                <label htmlFor='file-input'>
                  {questionImage ? (
                    <CancelIcon
                      style={{ width: '30px', marginTop: '8px' }}
                      onClick={() => {
                        setTimeout(() => {
                          setQuestionImage('');
                        }, 100);
                      }}
                    />
                  ) : (
                    <AttachFileIcon style={{ width: '19px', marginTop: '8px' }} />
                  )}

                  {!questionImage && (
                    <input
                      id='file-input'
                      type='file'
                      style={{ display: 'none' }}
                      onChange={(e) => getAttachment(e, 'question')}
                      accept='*'
                    />
                  )}
                </label>
              </span>
            </div>
            <div className='mx-2'>
              <div>
                {question.question_type !== 'subjective' &&
                  question.option_array.map((e, i) => {
                    return (
                      <Row key={e.text}>
                        {/* <Col className='d-flex align-items-center justify-content-center' xs={1}>
                      <div onClick={() => removeOption(e)}>
                        {i === answerArray.length - 1 && i > 1 ? '-' : null}
                      </div>
                    </Col> */}
                        <Col xs={9}>
                          <div className='Homework__inlineEditor optionUpperC m-2'>
                            <input
                              className='optionsInput'
                              type='text'
                              onChange={(ev) => updateOptionText(ev.target.value, i)}
                              value={options[i].text}
                              // placeholder={`Option ${e.value}`}
                            />
                            <span className='Homework__ckAttach'>
                              <label htmlFor={`file-inputer${e.text}`}>
                                {e.image ? (
                                  <CancelIcon
                                    style={{ width: '30px', marginTop: '8px' }}
                                    onClick={() => {
                                      setTimeout(() => {
                                        // removeAnswerAttachment(e.value);
                                      }, 100);
                                    }}
                                  />
                                ) : (
                                  <AttachFileIcon style={{ width: '19px', marginTop: '8px' }} />
                                )}

                                {
                                  <input
                                    id={`file-inputer${e.value}`}
                                    type='file'
                                    style={{ display: 'none' }}
                                    // onChange={(evt) => getImageAttachment(evt, e.value)}
                                    accept='*'
                                  />
                                }
                              </label>
                            </span>
                          </div>
                        </Col>
                        <Col style={{ display: 'flex' }} xs={1} className='p-0'>
                          <Form.Check
                            type='checkbox'
                            checked={e.isSelected}
                            // onChange={() => selectDefaultOption(e.value)}
                            className='my-auto'
                            name='option'
                          />
                        </Col>
                        <Col className='d-flex align-items-center justify-content-center' xs={1}>
                          <div
                            role='button'
                            tabIndex={-1}
                            className='removeOptionBtn'
                            onClick={() => {}}
                            onKeyDown={() => {}}
                          >
                            {i === question.option_array.length - 1 && i > 1 ? '-' : null}
                          </div>
                        </Col>
                      </Row>
                    );
                  })}
                {question.type !== 'subjective' && question.option_array.length < 6 && (
                  <Row className='mb-3'>
                    <button
                      className='addMoreOptionsBtn'
                      type='button'
                      // onClick={() => increaseOptionLength()}
                    >
                      +{' '}
                      <span style={{ fontSize: '14px', marginLeft: '10px' }}>Add more options</span>
                    </button>
                  </Row>
                )}
              </div>
            </div>
            {question.question_type === 'subjective' ? (
              <div className='d-flex questionUpperC my-2 mx-3'>
                <textarea
                  placeholder='Answer'
                  // onChange={(e) => updateAnswerText(e.target.value)}
                  className='questionTextarea'
                />
              </div>
            ) : null}
            <div className='d-flex questionUpperC my-2 mx-3'>
              <textarea
                placeholder='Solution'
                // onChange={(e) => updateSolution(e.target.value)}
                className='questionTextarea'
              />
              <span className='Homework__ckAttach mt-1'>
                <label htmlFor='file-inputer'>
                  {solutionImage ? (
                    <CancelIcon
                      style={{ width: '30px', marginTop: '8px' }}
                      onClick={() => {
                        setTimeout(() => {
                          // updateSolutionImage('');
                        }, 100);
                      }}
                    />
                  ) : (
                    <AttachFileIcon style={{ width: '19px', marginTop: '8px' }} />
                  )}
                  {!solutionImage && (
                    <input
                      id='file-inputer'
                      type='file'
                      style={{ display: 'none' }}
                      // onChange={(e) => getAttachment(e, 'solution')}
                      accept='*'
                    />
                  )}
                </label>
              </span>
            </div>
            <div className='d-flex justify-content-end m-3 mt-4'>
              <Button
                className='addBtnHW'
                // disabled={!addButtonDisabledCheck}
                variant='customPrimarySmol'
                // onClick={() => addQuestion()}
              >
                ADD
              </Button>
            </div>
          </div>

          <div>
            <h1 className='Homework__options text-center hideOnDesktopHW'>Preview</h1>

            <h3 className='Homework__options'>Question</h3>
            <div className='d-flex mb-3 Homework__questionHeading'>
              {/* <MathJax math={String.raw`${question}`} /> */}
              {questionText}
            </div>
            {questionImage && <img src={questionImage} alt='question ' className='img-fluid m-1' />}

            {question.question_type !== 'subjective' ? (
              <>
                <h3 className='Homework__options'>Options</h3>
                {question.option_array.map((e) => {
                  return (
                    <Row className='Homework__previewText ml-1' key={e.value}>
                      <Col xs={1}>
                        <p className='Homework__options'>
                          {e.value === '1'
                            ? 'A'
                            : e.value === '2'
                            ? 'B'
                            : e.value === '3'
                            ? 'C'
                            : e.value === '4'
                            ? 'D'
                            : e.value === '5'
                            ? 'E'
                            : e.value === '6'
                            ? 'F'
                            : '.'}
                          .
                        </p>
                      </Col>
                      {e.text ? (
                        <Col>
                          <div className='Homework__multipleOptions'>
                            {/* <MathJax math={String.raw`${e.text}`} /> */}
                            {e.text}
                          </div>
                        </Col>
                      ) : null}
                      {e.image ? (
                        <Col>
                          {e.image && <img src={e.image} alt='option' className='img-fluid m-1' />}
                        </Col>
                      ) : null}
                    </Row>
                  );
                })}
              </>
            ) : null}
            {question.question_type === 'subjective' ? (
              <>
                <h3 className='Homework__options'>Answer</h3>
                <div className='d-flex Homework__questionHeading mb-3'>
                  {/* <MathJax math={String.raw`${solution}`} /> */}
                  {/* {answerText} */}
                </div>
              </>
            ) : null}
            <h3 className='Homework__options'>Solution</h3>
            <div className='d-flex Homework__questionHeading'>
              {/* <MathJax math={String.raw`${solution}`} /> */}
              {/* {solution} */}
            </div>
            {solutionImage && <img src={solutionImage} alt='solution' className='img-fluid m-1' />}
          </div>
        </Modal.Body>
      </Modal>
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
