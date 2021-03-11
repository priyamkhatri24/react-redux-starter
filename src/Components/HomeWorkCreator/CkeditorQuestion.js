import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Swal from 'sweetalert2';
import Select from 'react-select';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import { CKEditor } from '@ckeditor/ckeditor5-react';
// NOTE: Use the editor from source (not a build)!
import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
import InlineEditor from '@ckeditor/ckeditor5-editor-inline/src/inlineeditor';
import Mathematics from 'ckeditor5-math/src/math';
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import { get, apiValidation, uploadImage } from '../../Utilities';

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
    add,
  } = props;
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [currentClassId, setCurrentClassId] = useState(0);
  const [chapters, setChapters] = useState([]);
  const [type, setType] = useState('');
  const [selectedChapter, setSelectedChapter] = useState('');
  const [currentSubject, setCurrentSubject] = useState();

  const editorConfiguration = {
    plugins: [Essentials, Bold, Italic, Paragraph, Mathematics],
    toolbar: ['bold', 'italic', 'math'],
    math: {
      engine: 'mathjax', // or katex or function. E.g. (equation, element, display) => { ... }
      lazyLoad: undefined, // async () => { ... }, called once before rendering first equation if engine doesn't exist.
      // After resolving promise, plugin renders equations.
      outputType: 'span', // or span
      forceOutputType: false, // forces output to use outputType
      enablePreview: true, // Enable preview view
    },
    placeholder: 'Question',
    styles: ['full', 'side'],
  };

  const solutionConfiguration = {
    plugins: [Essentials, Bold, Italic, Paragraph, Mathematics],
    toolbar: ['bold', 'italic', 'math'],
    math: {
      engine: 'mathjax', // or katex or function. E.g. (equation, element, display) => { ... }
      lazyLoad: undefined, // async () => { ... }, called once before rendering first equation if engine doesn't exist.
      // After resolving promise, plugin renders equations.
      outputType: 'span', // or span
      forceOutputType: false, // forces output to use outputType
      enablePreview: true, // Enable preview view
    },
    placeholder: 'Solution',
    styles: ['full', 'side'],
  };

  const typeOfQuestion = [
    { label: 'MCQ - Single Choice', value: 'single' },
    { label: 'MCQ - Multiple Choice', value: 'multiple' },
    { label: 'Subjective', value: 'subjective' },
  ];

  useEffect(() => {
    get('', '/getClassesForHomeworkCreator').then((res) => {
      const result = apiValidation(res);
      const selectClasses = result.map((e) => {
        e.label = e.class_name;
        e.value = e.class_id;
        return e;
      });
      console.log(selectClasses);
      setClasses(selectClasses);
      console.log(result);
    });
  }, []);

  const setCurrentSubjects = (opt) => {
    setSubjects({ label: null, value: null });
    const selectSubject = opt.subject_array.map((e) => {
      e.label = e.subject_name;
      e.value = e.subject_id;
      return e;
    });

    setCurrentClassId(opt.class_id);
    setSubjects(selectSubject);
  };

  const setCurrentChapters = (opt) => {
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
      setChapters(modifiedChapters);
    });
  };

  const getAttachment = (e, types) => {
    const file = e.target.files[0];
    uploadImage(file).then((res) => {
      console.log('fileu;lod ', res);

      types === 'question' ? updateQuestionImages(res.filename) : updateSolutionImage(res.filename);
    });
  };

  const getImageAttachment = (e, value) => {
    const newAnswerArray = JSON.parse(JSON.stringify(answerArray));
    console.log(newAnswerArray[value - 1]);
    const file = e.target.files[0];
    uploadImage(file).then((res) => {
      newAnswerArray[value - 1].image = res.filename; // this currently works because value is index+1.
    }); // if made dynamic shall not work
    updateOptionArray(newAnswerArray);
    console.log(newAnswerArray);
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

    add(payload);
  };

  return (
    <Card className='Homework__selectCard mb-3 mx-2'>
      <Row className='m-0 justify-content-center'>
        <Col xs={5} className='my-3 mx-auto p-0'>
          <Select
            options={classes}
            placeholder='Course'
            onChange={(opt) => setCurrentSubjects(opt)}
          />
        </Col>
        <Col xs={5} className='my-3 mx-auto p-0'>
          <Select
            options={subjects}
            placeholder='Subject'
            onChange={(opt) => setCurrentChapters(opt)}
          />
        </Col>
        <Col xs={5} className='my-3 mx-auto p-0'>
          <Select
            options={chapters}
            placeholder='Chapter'
            onChange={(opt) => setSelectedChapter(opt.value)}
          />
        </Col>
        <Col xs={5} className='my-3 mx-auto p-0'>
          <Select
            options={typeOfQuestion}
            placeholder='Type'
            onChange={(opt) => setType(opt.value)}
          />
        </Col>
      </Row>
      <div className='d-flex my-2 mx-3'>
        <span className='Homework__ckQuestion my-auto'>Question</span>
        <span className='ml-auto'>
          {questionImage && <span className='Homework__ckQuestion mr-2'>Atachment Selected</span>}
          <span className='Homework__ckAttach'>
            <label htmlFor='file-input'>
              <AttachFileIcon />
              <input
                id='file-input'
                type='file'
                style={{ display: 'none' }}
                onChange={(e) => getAttachment(e, 'question')}
                accept='*'
              />
            </label>
          </span>
        </span>
      </div>
      <div className='mx-2'>
        <CKEditor
          editor={ClassicEditor}
          config={editorConfiguration}
          onReady={(editor) => {
            // You can store the "editor" and use when it is needed.
            console.log('Editor is ready to use!', editor);
          }}
          onChange={(event, editor) => {
            const data = editor.getData();
            //   console.log({ event, editor, data });
            updateQuestion(data);
          }}
          onBlur={(event, editor) => {
            //   console.log('Blur.', editor);
          }}
          onFocus={(event, editor) => {
            //   console.log('Focus.', editor);
          }}
        />
        <div className='mt-4'>
          {type !== 'subjective' &&
            answerArray.map((e) => {
              const configurationOptions = {
                plugins: [Essentials, Bold, Italic, Paragraph, Mathematics],
                toolbar: ['bold', 'italic', 'math'],
                math: {
                  engine: 'mathjax', // or katex or function. E.g. (equation, element, display) => { ... }
                  lazyLoad: undefined,
                  outputType: 'span', // or span
                  forceOutputType: false, // forces output to use outputType
                  enablePreview: true, // Enable preview view
                },
                placeholder: `Option ${e.value}`,
                styles: ['full', 'side'],
              };
              return (
                <Row key={e.value}>
                  <Col xs={10}>
                    <div className='Homework__inlineEditor m-2'>
                      <CKEditor
                        editor={InlineEditor}
                        config={configurationOptions}
                        onReady={(editor) => {
                          // You can store the "editor" and use when it is needed.
                          //    console.log('Editor is ready to use!', editor);
                        }}
                        onChange={(event, editor) => {
                          const data = editor.getData();
                          //   console.log({ event, editor, data });
                          updateOptionText(data, e.value);
                        }}
                        onBlur={(event, editor) => {
                          //     console.log('Blur.', editor);
                        }}
                        onFocus={(event, editor) => {
                          //     console.log('Focus.', editor);
                        }}
                      />
                    </div>
                  </Col>
                  <Col xs={2} className='p-0'>
                    <div className='d-flex'>
                      <span className='Homework__ckAttach'>
                        <label htmlFor={`file-inputer${e.value}`}>
                          <AttachFileIcon />
                          <input
                            id={`file-inputer${e.value}`}
                            type='file'
                            style={{ display: 'none' }}
                            onChange={(evt) => getImageAttachment(evt, e.value)}
                            accept='*'
                          />
                        </label>
                      </span>
                      <Form.Check
                        type='checkbox'
                        checked={e.isSelected}
                        onChange={() => selectDefaultOption(e.value)}
                        className='my-auto'
                      />
                    </div>
                  </Col>
                </Row>
              );
            })}
        </div>
        <div className='d-flex mt-4 mb-2 mx-3'>
          <span className='Homework__ckQuestion my-auto'>Solution</span>
          <span className='ml-auto'>
            {solutionImage && <span className='Homework__ckQuestion mr-2'>Atachment Selected</span>}
            <span className='Homework__ckAttach'>
              <label htmlFor='file-input'>
                <AttachFileIcon />
                <input
                  id='file-input'
                  type='file'
                  style={{ display: 'none' }}
                  onChange={(e) => getAttachment(e, 'solution')}
                  accept='*'
                />
              </label>
            </span>
          </span>
        </div>
        <div className='mx-2'>
          <CKEditor
            editor={ClassicEditor}
            config={solutionConfiguration}
            onReady={(editor) => {
              // You can store the "editor" and use when it is needed.
              console.log('Editor is ready to use!', editor);
            }}
            onChange={(event, editor) => {
              const data = editor.getData();
              //   console.log({ event, editor, data });
              updateSolution(data);
            }}
            onBlur={(event, editor) => {
              //     console.log('Blur.', editor);
            }}
            onFocus={(event, editor) => {
              //     console.log('Focus.', editor);
            }}
          />
        </div>
      </div>
      <div className='d-flex justify-content-end m-3 mt-4'>
        <Button variant='customPrimarySmol' onClick={() => addQuestion()}>
          ADD
        </Button>
      </div>
    </Card>
  );
};

export default CkeditorQuestion;

CkeditorQuestion.propTypes = {
  updateQuestion: PropTypes.func.isRequired,
  updateOptionArray: PropTypes.func.isRequired,
  updateQuestionImages: PropTypes.func.isRequired,
  questionImage: PropTypes.string.isRequired,
  answerArray: PropTypes.instanceOf(Array).isRequired,
  updateSolution: PropTypes.func.isRequired,
  solutionImage: PropTypes.string.isRequired,
  updateSolutionImage: PropTypes.func.isRequired,
  add: PropTypes.func.isRequired,
};
