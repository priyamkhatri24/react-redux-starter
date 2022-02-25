import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Swal from 'sweetalert2';
import Select from 'react-select/creatable';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import CancelIcon from '@material-ui/icons/Cancel';
// import { CKEditor } from '@ckeditor/ckeditor5-react';
// // NOTE: Use the editor from source (not a build)!
// import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
// import InlineEditor from '@ckeditor/ckeditor5-editor-inline/src/inlineeditor';
// import Mathematics from 'ckeditor5-math/src/math';
// import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
// import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
// import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
// import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import { get, apiValidation, uploadImage, post } from '../../Utilities';
import { homeworkActions } from '../../redux/actions/homework.action';
import {
  getSelectedCourse,
  getSelectedSubject,
  getSelectedChapter,
  getSelectedType,
} from '../../redux/reducers/homeworkCreator.reducer';
import './HomeWorkCreator.scss';

const CkeditorQuestion = (props) => {
  const {
    updateQuestion,
    updateSolution,
    solutionImage,
    updateOptionArray,
    answerArray,
    updateQuestionImages,
    updateSolutionImage,
    questionImage,
    answerText,
    updateAnswerText,
    questionText,
    updateType,
    setCurrentChapterArrayToStore,
    setCurrentSubjectArrayToStore,
    setSelectedChapterToStore,
    setSelectedCourseToStore,
    setSelectedSubjectToStore,
    setSelectedTypeToStore,
    selectedCourseFromStore,
    selectedSubjectFromStore,
    selectedChapterFromStore,
    selectedTypeFromStore,
    add,
    clientId,
    compressed,
  } = props;
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [currentClassId, setCurrentClassId] = useState(0);
  const [chapters, setChapters] = useState([]);
  const [type, setType] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedChapter, setSelectedChapter] = useState('');
  const [currentSubject, setCurrentSubject] = useState('');
  const [createNewClassModal, setCreateNewClassModal] = useState(false);
  const [createNewSubjectModal, setCreateNewSubjectModal] = useState(false);
  const [createNewChapterModal, setCreateNewChapterModal] = useState(false);
  const [newCourse, setNewCourse] = useState('');
  const [newSubject, setNewSubject] = useState('');
  const [newChapter, setNewChapter] = useState('');
  const [classesMarkup, setClassesMarkup] = useState('');
  const [chapterMarkup, setChapterMarkup] = useState('');
  const [subjectMarkup, setSubjectMarkup] = useState('');
  const classSelectRef = useRef(null);
  const subjectSelectRef = useRef(null);
  const chapterSelectRef = useRef(null);
  const [addButtonDisabledCheck, setAddButtonDisabledCheck] = useState(false);
  const [disabledText, setDisabledText] = useState('');
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    /* eslint-disable */
    if (
      classSelectRef &&
      classSelectRef.current &&
      subjectSelectRef &&
      subjectSelectRef.current &&
      chapterSelectRef &&
      chapterSelectRef.current
    ) {
      setTimeout(() => {
        if (selectedCourseFromStore) {
          classSelectRef.current.value = selectedCourseFromStore?.class_id;
          setCurrentClassId(selectedCourseFromStore?.class_id);
          setSubjects(selectedCourseFromStore.subject_array);
          setSelectedClass(selectedCourseFromStore);
        }
        setSelectedSubject(selectedSubjectFromStore);
        setSelectedChapter(selectedChapterFromStore);
        setType(selectedTypeFromStore);
        setTimeout(() => {
          if (selectedSubjectFromStore) {
            subjectSelectRef.current.value = selectedSubjectFromStore?.subject_id;
            get(
              { class_subject_id: selectedSubjectFromStore.class_subject_id },
              '/getChaptersOfClassSubject2',
            ).then((respp) => {
              /* eslint-disable */
              const result = apiValidation(respp);
              setChapters(result);
              setTimeout(() => {
                if (selectedChapterFromStore) {
                  chapterSelectRef.current.value = selectedChapterFromStore?.chapter_id;
                }
              }, 200);
            });
          }
        }, 200);
      }, 200);
    }
  }, [
    selectedCourseFromStore,
    selectedSubjectFromStore,
    selectedChapterFromStore,
    classSelectRef,
    subjectSelectRef,
    chapterSelectRef,
  ]);

  useEffect(() => {
    if (!selectedClass || !selectedSubject || !selectedChapter || !type) {
      setAddButtonDisabledCheck(false);
    } else if (!questionImage && !questionText) {
      setAddButtonDisabledCheck(false);
    } else if (type === 'single' && answerArray.every((ele) => !ele.text && !ele.image)) {
      setAddButtonDisabledCheck(false);
    } else if (type === 'multiple' && answerArray.every((ele) => !ele.text && !ele.image)) {
      setAddButtonDisabledCheck(false);
      // } else if (type === 'single' && !answerArray.find((ele) => ele.isSelected)) {
      //   setAddButtonDisabledCheck(false);
      // } else if (type === 'multiple' && !answerArray.find((ele) => ele.isSelected)) {
      //   setAddButtonDisabledCheck(false);
    } else if (type === 'sujective' && !answerText) {
      setAddButtonDisabledCheck(false);
    } else {
      setAddButtonDisabledCheck(true);
    }
  });

  useEffect(() => {
    if (classes.length) {
      const markup = classes.map((elem) => {
        return (
          <option key={elem.class_id} value={elem.class_id}>
            {elem.class_name}
          </option>
        );
      });
      setClassesMarkup(markup);
    }
  }, [classes]);

  useEffect(() => {
    const markup = subjects.map((elem) => {
      return (
        <option key={elem.subject_id} value={elem.subject_id}>
          {elem.subject_name}
        </option>
      );
    });
    setSubjectMarkup(markup);
  }, [subjects]);

  useEffect(() => {
    const markup = chapters.map((elem) => {
      return (
        <option key={elem.chapter_id} value={elem.chapter_id}>
          {elem.chapter_name}
        </option>
      );
    });
    setChapterMarkup(markup);
  }, [chapters]);

  const typeOfQuestion = [
    { label: 'MCQ - Single Choice', value: 'single' },
    { label: 'MCQ - Multiple Choice', value: 'multiple' },
    { label: 'Subjective', value: 'subjective' },
  ];

  useEffect(() => {
    get({ client_id: clientId }, '/getClassesForClient').then((res) => {
      const result = apiValidation(res);
      const selectClasses = result.map((e) => {
        e.label = e.class_name;
        e.value = e.class_id;
        return e;
      });
      // selectClasses.push({ label: 'Create new', value: 'createNew', color: '#2699FB' });
      setClasses(selectClasses);
    });
  }, []);

  const createNewClassForClient = () => {
    const payload = {
      client_id: clientId,
      class_name: newCourse,
    };
    const newClasses = [...classes];
    newClasses.push({
      value: newCourse,
      label: newCourse,
      class_name: newCourse,
      subject_array: [],
      class_id: newCourse,
    });
    setClasses(newClasses);
    classSelectRef.current.value = newCourse;
    setCreateNewClassModal(false);

    post(payload, '/addClassToClient').then((res) => {
      Swal.fire({
        title: 'Success',
        text: 'New course created',
        icon: 'success',
        confirmButtonText: `Okay`,
        showCloseButton: false,
        showCancelButton: false,
        cancelButtonText: `No`,
        customClass: 'Assignments__SweetAlert',
      }).then((result) => {
        if (result.isConfirmed) {
          get({ client_id: clientId }, '/getClassesForClient').then((resp) => {
            const resultant = apiValidation(resp);
            setClasses(resultant);
            const newSelectedCourse = resultant.find((ele) => ele.class_name === newCourse);
            setSelectedClass(newSelectedCourse);
            setSelectedCourseToStore(newSelectedCourse);
            setSubjects(newSelectedCourse.subject_array);
            setCurrentClassId(newSelectedCourse.class_id);
            setTimeout(() => {
              classSelectRef.current.value = newSelectedCourse.class_id;
            }, 200);
          });
        }
      });
    });
  };

  const createNewSubjectForClient = () => {
    const payload = {
      class_id: selectedClass.class_id,
      subject_name: newSubject,
    };
    post(payload, '/addSubject2').then((res) => {
      Swal.fire({
        title: 'Success',
        text: 'New subject added to course',
        icon: 'success',
        confirmButtonText: `Okay`,
        showCloseButton: false,
        showCancelButton: false,
        cancelButtonText: `No`,
        customClass: 'Assignments__SweetAlert',
      }).then((result) => {
        setCreateNewSubjectModal(false);
        get({ client_id: clientId }, '/getClassesForClient').then((resp) => {
          const resultant = apiValidation(resp);
          const selectedClassObj = resultant.find((ele) => ele.class_id === selectedClass.class_id);
          setSubjects(selectedClassObj.subject_array);
          const selectedSubObj = selectedClassObj.subject_array.find(
            (ele) => ele.subject_name === newSubject,
          );
          setTimeout(() => {
            subjectSelectRef.current.value = selectedSubObj.subject_id;
            setSelectedSubject(selectedSubObj);
            setSelectedSubjectToStore(selectedSubObj);
            setCurrentSubjectArrayToStore([selectedSubObj.subject_id]);
          }, 200);
        });
      });
    });
  };

  const createNewChapterForClient = () => {
    const payload = {
      class_subject_id: selectedSubject.class_subject_id,
      chapter_name: newChapter,
    };
    post(payload, '/addChapter2').then((res) => {
      Swal.fire({
        title: 'Success',
        text: 'New chapter added to subject',
        icon: 'success',
        confirmButtonText: `Okay`,
        showCloseButton: false,
        showCancelButton: false,
        cancelButtonText: `No`,
        customClass: 'Assignments__SweetAlert',
      }).then((result) => {
        setCreateNewChapterModal(false);
        get({ client_id: clientId }, '/getClassesForClient').then((resp) => {
          const resultant = apiValidation(resp);
          const selectedClassObj = resultant.find((ele) => ele.class_id === selectedClass.class_id);
          const selectedSubObj = selectedClassObj.subject_array.find(
            (ele) => ele.subject_name === selectedSubject.subject_name,
          );
          setTimeout(() => {
            get(
              { class_subject_id: selectedSubObj.class_subject_id },
              '/getChaptersOfClassSubject2',
            ).then((respp) => {
              /* eslint-disable */
              const result = apiValidation(respp);

              // modifiedChapters.push({ label: 'Create new', value: 'createNew', color: '#2699FB' });
              setChapters(result);
              setTimeout(() => {
                const selectedChapObj = result.find((ele) => ele.chapter_name === newChapter);
                chapterSelectRef.current.value = selectedChapObj.chapter_id;
                setSelectedChapter(selectedChapObj);
                setSelectedChapterToStore(selectedChapObj);
                setCurrentChapterArrayToStore([selectedChapObj.chapter_id]);
              }, 200);
            });
          }, 200);
        });
      });
    });
  };

  const setCurrentSubjects = (opt) => {
    if (opt.value === 'createNew') {
      setCreateNewClassModal(true);
    } else {
      setSubjects({ label: null, value: null });
      const selectSubject = opt.subject_array.map((e) => {
        e.label = e.subject_name;
        e.value = e.subject_id;
        return e;
      });
      // selectSubject.push({ label: 'Create new', value: 'createNew', color: '#2699FB' });
      setCurrentClassId(opt.class_id);
      setSubjects(selectSubject);
    }
  };

  const setCurrentChapters = (opt) => {
    if (opt.value === 'createNew') {
      setCreateNewSubjectModal(true);
    } else {
      const subjectArray = [];
      subjectArray.push(opt.value);
      setCurrentSubject(opt.value);
      const payload = {
        class_id: currentClassId,
        subject_array: JSON.stringify(subjectArray),
      };

      get(payload, '/getChaptersOfClassSubject').then((res) => {
        const result = apiValidation(res);
        const modifiedChapters = result.map((e) => {
          e.value = e.chapter_id;
          e.label = e.chapter_name;
          return e;
        });
        // modifiedChapters.push({ label: 'Create new', value: 'createNew', color: '#2699FB' });
        setChapters(modifiedChapters);
        console.log(modifiedChapters, 'MC');
      });
    }
  };

  const getAttachment = (e, types) => {
    const file = e.target.files[0];
    uploadImage(file).then((res) => {
      console.log('fileu;lod ', res);
      console.log(types);
      if (types === 'question') {
        updateQuestionImages(res.filename);
      } else updateSolutionImage(res.filename);
    });
  };

  const getImageAttachment = (e, value) => {
    const newAnswerArray = [...answerArray];
    console.log(newAnswerArray[value - 1]);
    const file = e.target.files[0];
    uploadImage(file).then((res) => {
      console.log(res, 'wtf');
      newAnswerArray[value - 1].image = res.filename; // this currently works because value is index+1.
      updateOptionArray(newAnswerArray);
    }); // if made dynamic shall not work
  };

  const removeAnswerAttachment = (value) => {
    const newAnswerArray = [...answerArray];
    newAnswerArray[value - 1].image = '';
    updateOptionArray(newAnswerArray);
  };

  const selectDefaultOption = (value) => {
    const newAnswerArray = JSON.parse(JSON.stringify(answerArray));

    if (type === 'multiple') {
      newAnswerArray[value - 1].isSelected = !newAnswerArray[value - 1].isSelected;
    } else if (type === 'single') {
      if (newAnswerArray[value - 1].isSelected === true) {
        newAnswerArray[value - 1].isSelected = false;
      } else {
        const count = newAnswerArray.filter((e) => e.isSelected === true);
        if (count.length === 0)
          newAnswerArray[value - 1].isSelected = !newAnswerArray[value - 1].isSelected;
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops',
        text: 'Select a type to proceed',
      });
    }
    updateOptionArray(newAnswerArray);
  };

  const updateOptionText = (data, value) => {
    const newAnswerArray = JSON.parse(JSON.stringify(answerArray));
    newAnswerArray[value - 1].text = data;
    updateOptionArray(newAnswerArray);
  };

  const addQuestion = () => {
    const payload = {
      type,
      selectedChapter,
      currentClass: currentClassId,
      subject: currentSubject,
    };
    if (
      (type === 'single' && answerArray.find((ele) => ele.isSelected)) ||
      (type === 'multiple' && answerArray.find((ele) => ele.isSelected))
    ) {
      add(payload);
    } else {
      Swal.fire({
        text: 'Please select one correct answer',
      });
    }
  };

  const increaseOptionLength = () => {
    // console.log(answerArray);
    if (answerArray.length === 6) return;
    const newAnswerArray = [...answerArray];
    const newoption = {
      value: (answerArray.length + 1).toString(),
      image: '',
      isSelected: false,
      text: '',
    };
    newAnswerArray.push(newoption);
    console.log(newAnswerArray);
    updateOptionArray(newAnswerArray);
  };

  const removeOption = (ele) => {
    const newAnswerArray = answerArray.filter((elem) => elem.value !== ele.value);
    updateOptionArray(newAnswerArray);
  };

  return (
    <>
      <Card
        className={`mobileMargin Homework__selectCard mb-3 prvm-0${compressed ? ' expanded' : ''}`}
      >
        <Row className='m-0'>
          <Col xs={5} className='my-2 mx-auto p-0'>
            {/* <Select
                options={classes}
                placeholder='Course'
                styles={colourStyles}
                onChange={(opt) => {
                  setCurrentSubjects(opt);
                }}
              /> */}
            <label className='my-auto w-100'>
              <select
                ref={classSelectRef}
                style={{ boxShadow: 'none' }}
                className='form-control'
                name='Course'
                type='select'
                step='1'
                placeholder='Course'
                value={selectedClass?.class_id}
                onChange={(e) => {
                  if (e.target.value === 'createNew') {
                    setCurrentSubjects({ value: e.target.value });
                  } else {
                    const selectedClassObj = classes.find((ele) => ele.class_id == e.target.value);
                    setSelectedClass(selectedClassObj);
                    setSelectedCourseToStore(selectedClassObj);
                    setCurrentSubjects(selectedClassObj);
                  }
                }}
              >
                <option value='' disabled selected={!newCourse}>
                  Course
                </option>
                {classesMarkup}
                <option value='createNew'>Create new class</option>
              </select>
            </label>
          </Col>
          <Col xs={5} className='my-2 mx-auto p-0'>
            {/* <Select
                options={subjects}
                styles={colourStyles}
                placeholder='Subject'
                isDisabled={!currentClassId}
                onChange={(opt) => setCurrentChapters(opt)}
              /> */}
            <label className='my-auto w-100'>
              <select
                ref={subjectSelectRef}
                style={{ boxShadow: 'none' }}
                className='form-control'
                name='Subject'
                disabled={!currentClassId}
                type='select'
                step='1'
                placeholder='Subject'
                value={selectedSubject?.subject_id}
                onChange={(e) => {
                  if (e.target.value === 'createNew') {
                    setCurrentChapters({ value: e.target.value });
                  } else {
                    const selectedSubObj = subjects.find((ele) => ele.subject_id == e.target.value);
                    setSelectedSubject(selectedSubObj);
                    setSelectedSubjectToStore(selectedSubObj);
                    setCurrentSubjectArrayToStore([selectedSubObj.subject_id]);
                    setCurrentChapters(selectedSubObj);
                  }
                }}
              >
                <option value='' disabled selected>
                  Subject
                </option>
                {subjectMarkup}
                <option value='createNew'>Create new subject</option>
              </select>
            </label>
          </Col>
          <Col xs={5} className='my-2 mx-auto p-0'>
            {/* <Select
                options={chapters}
                styles={colourStyles}
                placeholder='Chapter'
                isDisabled={!currentSubject}
                onChange={(opt) => {
                  if (opt.value === 'createNew') {
                    setCreateNewChapterModal(true);
                  } else {
                    setSelectedChapter(opt.value);
                  }
                }}
              /> */}
            <label className='my-auto w-100'>
              <select
                ref={chapterSelectRef}
                style={{ boxShadow: 'none' }}
                className='form-control'
                name='Chapter'
                disabled={!selectedSubject}
                type='select'
                step='1'
                placeholder='Chapter'
                value={selectedChapter?.chapter_id}
                onChange={(e) => {
                  if (e.target.value === 'createNew') {
                    setCreateNewChapterModal(true);
                  } else {
                    const selectedChapObj = chapters.find(
                      (ele) => ele.chapter_id == e.target.value,
                    );
                    setSelectedChapter(selectedChapObj);
                    setSelectedChapterToStore(selectedChapObj);
                    setCurrentChapterArrayToStore([selectedChapObj.chapter_id]);
                    // setCurrentChapters(selectedChapObj);
                  }
                }}
              >
                <option value='' disabled selected>
                  Chapter
                </option>
                {chapterMarkup}
                <option value='createNew'>Create new chapter</option>
              </select>
            </label>
          </Col>
          <Col xs={5} className='my-2 mx-auto p-0'>
            <Select
              options={typeOfQuestion}
              defaultValue={
                selectedTypeFromStore
                  ? typeOfQuestion.find((opt) => opt.value === selectedTypeFromStore)
                  : null
              }
              placeholder='Type'
              onChange={(opt) => {
                setType(opt.value);
                setSelectedTypeToStore(opt.value);
                updateType(opt.value);
              }}
            />
          </Col>
        </Row>
        <div className='d-flex questionUpperC my-2 mx-3'>
          <textarea
            onChange={(e) => updateQuestion(e.target.value)}
            placeholder='Question'
            className='questionTextarea'
          />
          <span className='Homework__ckAttach mt-1'>
            <label htmlFor='file-input'>
              {questionImage ? (
                <CancelIcon
                  style={{ width: '30px', marginTop: '8px' }}
                  onClick={() => {
                    setTimeout(() => {
                      updateQuestionImages('');
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
            {type !== 'subjective' &&
              answerArray.map((e, i) => {
                return (
                  <Row key={e.value}>
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
                          onChange={(ev) => updateOptionText(ev.target.value, e.value)}
                          placeholder={`Option ${e.value}`}
                        />
                        <span className='Homework__ckAttach'>
                          <label htmlFor={`file-inputer${e.value}`}>
                            {e.image ? (
                              <CancelIcon
                                style={{ width: '30px', marginTop: '8px' }}
                                onClick={() => {
                                  setTimeout(() => {
                                    removeAnswerAttachment(e.value);
                                  }, 100);
                                }}
                              />
                            ) : (
                              <AttachFileIcon style={{ width: '19px', marginTop: '8px' }} />
                            )}

                            {answerArray[e.value - 1].image ? null : (
                              <input
                                id={`file-inputer${e.value}`}
                                type='file'
                                style={{ display: 'none' }}
                                onChange={(evt) => getImageAttachment(evt, e.value)}
                                accept='*'
                              />
                            )}
                          </label>
                        </span>
                      </div>
                    </Col>
                    <Col style={{ display: 'flex' }} xs={1} className='p-0'>
                      <Form.Check
                        type='checkbox'
                        checked={e.isSelected}
                        onChange={() => selectDefaultOption(e.value)}
                        className='my-auto'
                        name='option'
                      />
                    </Col>
                    <Col className='d-flex align-items-center justify-content-center' xs={1}>
                      <div className='removeOptionBtn' onClick={() => removeOption(e)}>
                        {i === answerArray.length - 1 && i > 1 ? '-' : null}
                      </div>
                    </Col>
                  </Row>
                );
              })}
            {answerArray.length < 6 && (
              <Row className='mb-3'>
                <button
                  className='addMoreOptionsBtn'
                  type='button'
                  onClick={() => increaseOptionLength()}
                >
                  + <span style={{ fontSize: '14px', marginLeft: '10px' }}>Add more options</span>
                </button>
              </Row>
            )}
          </div>
        </div>
        {type === 'subjective' ? (
          <div className='d-flex questionUpperC my-2 mx-3'>
            <textarea
              placeholder='Answer'
              onChange={(e) => updateAnswerText(e.target.value)}
              className='questionTextarea'
            />
            {/* <span className='Homework__ckAttach mt-1'>
            <label htmlFor='file-inputer'>
              {solutionImage ? (
                <CancelIcon
                  style={{ width: '30px', marginTop: '8px' }}
                  onClick={() => {
                    setTimeout(() => {
                      updateSolutionImage('');
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
                  onChange={(e) => getAttachment(e, 'solution')}
                  accept='*'
                />
              )}
            </label>
          </span> */}
          </div>
        ) : null}
        <div className='d-flex questionUpperC my-2 mx-3'>
          <textarea
            placeholder='Solution'
            onChange={(e) => updateSolution(e.target.value)}
            className='questionTextarea'
          />
          <span className='Homework__ckAttach mt-1'>
            <label htmlFor='file-inputer'>
              {solutionImage ? (
                <CancelIcon
                  style={{ width: '30px', marginTop: '8px' }}
                  onClick={() => {
                    setTimeout(() => {
                      updateSolutionImage('');
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
                  onChange={(e) => getAttachment(e, 'solution')}
                  accept='*'
                />
              )}
            </label>
          </span>
        </div>
        <div className='d-flex justify-content-end m-3 mt-4'>
          <Button
            className='addBtnHW'
            disabled={!addButtonDisabledCheck}
            variant='customPrimarySmol'
            onClick={() => addQuestion()}
          >
            ADD
          </Button>
        </div>
      </Card>

      <Modal show={createNewClassModal} onHide={() => setCreateNewClassModal(false)} centered>
        <Modal.Body>
          <form className='text-center'>
            <label className='has-float-label w-75 my-3'>
              <input
                className='form-control'
                placeholder='Enter course name'
                type='text'
                value={newCourse}
                onChange={(e) => setNewCourse(e.target.value)}
              />
              <span>Enter course name</span>
            </label>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='dashboardBlueOnWhite' onClick={createNewClassForClient}>
            Create new class
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={createNewSubjectModal} onHide={() => setCreateNewSubjectModal(false)} centered>
        <Modal.Body>
          <form className='text-center'>
            <label className='has-float-label w-75 my-3'>
              <input
                className='form-control'
                placeholder='Enter Subject name'
                type='text'
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
              />
              <span>Enter Subject name</span>
            </label>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='dashboardBlueOnWhite' onClick={createNewSubjectForClient}>
            Create new subject
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={createNewChapterModal} onHide={() => setCreateNewChapterModal(false)} centered>
        <Modal.Body>
          <form className='text-center'>
            <label className='has-float-label w-75 my-3'>
              <input
                className='form-control'
                placeholder='Enter Chapter name'
                type='text'
                value={newChapter}
                onChange={(e) => setNewChapter(e.target.value)}
              />
              <span>Enter Chapter name</span>
            </label>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='dashboardBlueOnWhite' onClick={createNewChapterForClient}>
            Create new chapter
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    selectedCourseFromStore: getSelectedCourse(state),
    selectedSubjectFromStore: getSelectedSubject(state),
    selectedChapterFromStore: getSelectedChapter(state),
    selectedTypeFromStore: getSelectedType(state),
  };
};

const mapActionsToProps = (dispatch) => {
  return {
    setCurrentChapterArrayToStore: (payload) => {
      dispatch(homeworkActions.setCurrentChapterArrayToStore(payload));
    },
    setCurrentSubjectArrayToStore: (payload) => {
      dispatch(homeworkActions.setCurrentSubjectArrayToStore(payload));
    },
    setSelectedCourseToStore: (payload) => {
      dispatch(homeworkActions.setSelectedCourseToStore(payload));
    },
    setSelectedSubjectToStore: (payload) => {
      dispatch(homeworkActions.setSelectedSubjectToStore(payload));
    },
    setSelectedChapterToStore: (payload) => {
      dispatch(homeworkActions.setSelectedChapterToStore(payload));
    },
    setSelectedTypeToStore: (payload) => {
      dispatch(homeworkActions.setSelectedTypeToStore(payload));
    },
  };
};

export default connect(mapStateToProps, mapActionsToProps)(CkeditorQuestion);

CkeditorQuestion.propTypes = {
  updateQuestion: PropTypes.func.isRequired,
  questionText: PropTypes.string.isRequired,
  updateOptionArray: PropTypes.func.isRequired,
  updateQuestionImages: PropTypes.func.isRequired,
  questionImage: PropTypes.string.isRequired,
  answerArray: PropTypes.instanceOf(Array).isRequired,
  updateSolution: PropTypes.func.isRequired,
  updateAnswerText: PropTypes.func.isRequired,
  answerText: PropTypes.string.isRequired,
  updateType: PropTypes.func.isRequired,
  solutionImage: PropTypes.string.isRequired,
  updateSolutionImage: PropTypes.func.isRequired,
  add: PropTypes.func.isRequired,
  clientId: PropTypes.number.isRequired,
  setCurrentSubjectArrayToStore: PropTypes.func.isRequired,
  setCurrentChapterArrayToStore: PropTypes.func.isRequired,
  setSelectedCourseToStore: PropTypes.func.isRequired,
  setSelectedChapterToStore: PropTypes.func.isRequired,
  setSelectedSubjectToStore: PropTypes.func.isRequired,
  setSelectedTypeToStore: PropTypes.func.isRequired,
  setSelectedTypeToStore: PropTypes.func.isRequired,
  selectedCourseFromStore: PropTypes.instanceOf(Object).isRequired,
  selectedChapterFromStore: PropTypes.instanceOf(Object).isRequired,
  selectedSubjectFromStore: PropTypes.instanceOf(Object).isRequired,
  selectedTypeFromStore: PropTypes.string.isRequired,
  compressed: PropTypes.bool,
};

CkeditorQuestion.defaultProps = {
  compressed: false,
};
