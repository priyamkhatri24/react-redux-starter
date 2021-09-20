import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { connect } from 'react-redux';
import {
  getSelectedQuestionArray,
  getTestId,
  getTestName,
} from '../../redux/reducers/homeworkCreator.reducer';
import { getClientUserId } from '../../redux/reducers/clientUserId.reducer';
import { PageHeader } from '../Common';
import './HomeWorkCreator.scss';
import SectionDivider from './SectionDivider';
import { apiValidation, get, post } from '../../Utilities';
import FinalQuestionCard from './FinalQuestionCard';
import MarkingSchemeDecider from './MarkingSchemeDecider';
import { homeworkActions } from '../../redux/actions/homework.action';

const testInstructions =
  '1. The marking scheme is displayed on top, for each question.' +
  '\n2. To select an answer, click on the option.' +
  '\n3. To deselect an answer, click on the option again.' +
  '\n4. You can change your answer by clicking on some other option.' +
  '\n5. You can mark a question for review if you want to revisit the question again during the exam.' +
  "\n6. You can click on 'Next'  or 'Previous' to go through the questions sequentially. " +
  "\n7. A number list of all questions appears at the bottom of your screen, under 'Jump to Question'." +
  ' You can access the questions in any order within a ' +
  'section or across sections by clicking on the question number given on this list.' +
  "\n8. 'Attempted' questions will be marked blue, 'Marked for Review' questions will be marked yellow. " +
  '\n9. You can use rough sheets while taking the test. Do not use calculators,' +
  ' log tables, dictionaries, or any other printed/online reference material during the test.' +
  "\n10. Click on 'Submit Test' ONLY after completing the exam. An exam once submitted cannot be resumed. " +
  "\n11. By clicking on 'Start Exam', you agree that you have read all the instructions and you abide by them.";

const PreviewQuestions = (props) => {
  const {
    selectedQuestionArray,
    history,
    testName,
    testId,
    clientUserId,
    setTestClassSubjectToStore,
    setTestNameToStore,
  } = props;
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [assignmentName, setAssignmentName] = useState(testName);
  const [activeSection, setActiveSection] = useState('No Sections');
  const [instructions, setInstructions] = useState(testInstructions);
  const [sectionedQuestion, setSectionedQuestions] = useState([]);
  const [noOfSections, setNoOfSections] = useState(1);
  const [customSectionArray, setCustomSectionArray] = useState([
    { id: 1, name: 'Section 1', noOfQuestions: selectedQuestionArray.length, questions: [] },
  ]);

  const [isIndividualMarks, setIsIndividualMarks] = useState(false);
  const [fullPaperMarks, setFullPaperMarks] = useState([
    { id: 1, name: 'Correct', value: 0, color: 'rgba(0, 151, 0, 1)' },
    { id: 2, name: 'Incorrect', value: 0, color: 'rgba(255, 0, 0, 1)' },
    { id: 3, name: 'Unanswered', value: 0, color: 'rgba(86, 66, 61, 1)' },
  ]);
  const [sectionMarks, setSectionMarks] = useState([]);
  const [oldTestId, setOldTestId] = useState(null);

  useEffect(() => {
    if (activeSection === 'Subject Wise') {
      get({ test_id: testId }, '/getTestQuestionsSubjectWiseForHomeWorkCreator').then((res) => {
        const result = apiValidation(res);
        const values = Object.values(result).map((e) => {
          e.map((elem) => {
            elem.question_positive_marks = 0;
            elem.question_negative_marks = 0;
            elem.question_unanswered_marks = 0;
            return elem;
          });
          return e;
        });

        const resultArray = Object.keys(result).map((e, i) => {
          const obj = {};
          obj.name = e;
          obj.questions = values[i];
          return obj;
        });
        setSectionedQuestions(resultArray);

        const tempSectionMarks = resultArray.map((elem) => {
          if (!oldTestId) {
            setOldTestId(elem.testId);
          }
          const obj = {};
          obj.sectionName = elem.name;
          obj.marksArray = [
            { id: 1, name: 'Correct', value: 0, color: 'rgba(0, 151, 0, 1)' },
            { id: 2, name: 'Incorrect', value: 0, color: 'rgba(255, 0, 0, 1)' },
            { id: 3, name: 'Unanswered', value: 0, color: 'rgba(86, 66, 61, 1)' },
          ];
          return obj;
        });
        setSectionMarks(tempSectionMarks);
        setFullPaperMarks([
          { id: 1, name: 'Correct', value: 0, color: 'rgba(0, 151, 0, 1)' },
          { id: 2, name: 'Incorrect', value: 0, color: 'rgba(255, 0, 0, 1)' },
          { id: 3, name: 'Unanswered', value: 0, color: 'rgba(86, 66, 61, 1)' },
        ]);
      });
    } else {
      get({ test_id: testId || oldTestId }, '/getTestQuestionsForHomeWorkCreator').then((res) => {
        setTestClassSubjectToStore(res.class_subject);
        const result = apiValidation(res);
        const withMarks = result.map((e) => {
          e.question_positive_marks = 0;
          e.question_negative_marks = 0;
          e.question_unanswered_marks = 0;
          return e;
        });
        setSelectedQuestions(withMarks);
        setFullPaperMarks([
          { id: 1, name: 'Correct', value: 0, color: 'rgba(0, 151, 0, 1)' },
          { id: 2, name: 'Incorrect', value: 0, color: 'rgba(255, 0, 0, 1)' },
          { id: 3, name: 'Unanswered', value: 0, color: 'rgba(86, 66, 61, 1)' },
        ]);
      });
    }
  }, [testId, activeSection]);

  useEffect(() => {
    const tempArray = [...customSectionArray];
    if (noOfSections > customSectionArray.length) {
      const diffInLength = noOfSections - customSectionArray.length;
      for (let i = 0; i < diffInLength; i++) {
        tempArray.push({
          id: tempArray.length + 1,
          name: `Section ${tempArray.length + 1}`,
          noOfQuestions: 0,
          questions: [],
        });
      }
    } else {
      tempArray.length = noOfSections;
    }

    setCustomSectionArray(tempArray);
  }, [noOfSections]);

  useEffect(() => {
    if (activeSection === 'No Sections') {
      const updatedQuestions = selectedQuestions.map((e) => {
        e.question_positive_marks = fullPaperMarks[0].value;
        e.question_negative_marks = fullPaperMarks[1].value;
        e.question_unanswered_marks = fullPaperMarks[2].value;
        return e;
      });
      setSelectedQuestions(updatedQuestions);
    } else {
      const updatedQuestions = sectionedQuestion.map((elem) => {
        elem.questions.map((e) => {
          e.question_positive_marks = fullPaperMarks[0].value;
          e.question_negative_marks = fullPaperMarks[1].value;
          e.question_unanswered_marks = fullPaperMarks[2].value;
          return e;
        });
        return elem;
      });
      setSectionedQuestions(updatedQuestions);
    }
  }, [fullPaperMarks, activeSection]);

  const getSectionDetails = () => {
    let partition = 0;
    const tempCustomArray = JSON.parse(JSON.stringify(customSectionArray));
    const modifiedPartitionArray = tempCustomArray.map((e) => {
      e.noOfQuestions = partition + parseInt(e.noOfQuestions, 10);
      partition = e.noOfQuestions;
      return e;
    });

    let trailingPartition = 0;

    for (let i = 0; i < modifiedPartitionArray.length; i++) {
      for (let j = trailingPartition; j < modifiedPartitionArray[i].noOfQuestions; j++) {
        modifiedPartitionArray[i].questions.push(selectedQuestions[j]);
      }
      trailingPartition = modifiedPartitionArray[i].noOfQuestions;
    }

    setSectionedQuestions(modifiedPartitionArray);
    const tempSectionMarks = modifiedPartitionArray.map((elem) => {
      const obj = {};
      obj.sectionName = elem.name;
      obj.marksArray = [
        { id: 1, name: 'Correct', value: 0, color: 'rgba(0, 151, 0, 1)' },
        { id: 2, name: 'Incorrect', value: 0, color: 'rgba(255, 0, 0, 1)' },
        { id: 3, name: 'Unanswered', value: 0, color: 'rgba(86, 66, 61, 1)' },
      ];
      return obj;
    });
    setSectionMarks(tempSectionMarks);
    setFullPaperMarks([
      { id: 1, name: 'Correct', value: 0, color: 'rgba(0, 151, 0, 1)' },
      { id: 2, name: 'Incorrect', value: 0, color: 'rgba(255, 0, 0, 1)' },
      { id: 3, name: 'Unanswered', value: 0, color: 'rgba(86, 66, 61, 1)' },
    ]);
  };

  const updateQuestionMarks = (id, name, value, sectionName = '') => {
    if (activeSection === 'No Sections') {
      const updatedMarks = selectedQuestions.map((elem) => {
        if (elem.question_id === id) {
          if (name === 'Correct') elem.question_positive_marks = value;
          if (name === 'Incorrect') elem.question_negative_marks = value;
          if (name === 'Unanswered') elem.question_unanswered_marks = value;
        }
        return elem;
      });
      setSelectedQuestions(updatedMarks);
    } else {
      console.log(sectionedQuestion, id, name, value);
      const updatedMarks = sectionedQuestion.map((elem) => {
        if (elem.name === sectionName) {
          elem.questions.map((e) => {
            if (e.question_id === id) {
              if (name === 'Correct') e.question_positive_marks = value;
              if (name === 'Incorrect') e.question_negative_marks = value;
              if (name === 'Unanswered') e.question_unanswered_marks = value;
            }
            return e;
          });
        }
        return elem;
      });
      setSectionedQuestions(updatedMarks);
    }
  };

  const updateSectionMarks = (name, id, value) => {
    const updatedMarks = sectionedQuestion.map((elem) => {
      if (elem.name === name) {
        elem.questions.map((e) => {
          if (id === 1) e.question_positive_marks = value;
          if (id === 2) e.question_negative_marks = value;
          if (id === 3) e.question_unanswered_marks = value;
          return e;
        });
      }
      return elem;
    });

    const updatedSectionMarks = sectionMarks.map((e) => {
      if (e.sectionName === name) {
        e.marksArray.map((elem) => {
          if (elem.id === id) elem.value = value;
          return elem;
        });
      }
      return e;
    });
    setSectionMarks(updatedSectionMarks);
    setSectionedQuestions(updatedMarks);
  };

  const goToAssigner = () => {
    const sectionArray =
      activeSection === 'No Sections' ? ['test'] : sectionedQuestion.map((e) => e.name);
    let questionArray;
    post(
      { client_user_id: clientUserId, section_array: JSON.stringify(sectionArray) },
      '/addTestSection',
    ).then((res) => {
      console.log(res, 'imp j');
      const result = apiValidation(res);
      if (activeSection === 'No Sections') {
        questionArray = selectedQuestions.map((e) => {
          const obj = {};
          obj.section_id = result[0].section_id;
          obj.test_has_question_id = e.testHasQuestions_id;
          obj.question_positive_marks = e.question_positive_marks;
          obj.question_negative_marks = e.question_negative_marks;
          obj.question_unanswered_marks = e.question_unanswered_marks;
          return obj;
        });
      } else {
        const compact = result.reduce((acc, value) => {
          return { ...acc, [value.section_name]: value.section_id };
        }, {});

        questionArray = sectionedQuestion
          .map((elem) => {
            const objArray = elem.questions.map((e) => {
              const obj = {};
              obj.section_id = compact[elem.name];
              obj.test_has_question_id = e.testHasQuestions_id;
              obj.question_positive_marks = e.question_positive_marks;
              obj.question_negative_marks = e.question_negative_marks;
              obj.question_unanswered_marks = e.question_unanswered_marks;
              return obj;
            });
            return objArray;
          })
          .flat();
      }

      post(
        { question_array: JSON.stringify(questionArray) },
        '/updateMarksAndSectionsOfQuestionsInTest',
      ).then((resp) => {
        if (resp.success) {
          history.push('/homework/assign');
        }
      });
    });
  };

  const changeAssignmentName = (name) => {
    setAssignmentName(name);
    setTestNameToStore(name);
    post({ test_id: testId, is_draft: 1, test_name: name }, '/addTestFromHomeworkCreator').then(
      (res) => {
        console.log(res);
      },
    );
  };

  return (
    <>
      <PageHeader title='Preview' />
      <Card className='Homework__selectCard mx-2' style={{ marginTop: '5rem' }}>
        <label className='has-float-label my-3 mx-1 '>
          <input
            className='form-control'
            name='Assignment Name'
            type='text'
            placeholder='Assignment Name'
            value={assignmentName}
            onChange={(e) => changeAssignmentName(e.target.value)}
          />
          <span>Assignment Name</span>
        </label>

        <label className='has-float-label my-auto mx-1' style={{ height: '145px' }}>
          <textarea
            className='form-control'
            name='Instructions'
            type='text'
            placeholder='Instructions'
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            style={{
              height: '145px',
              fontFamily: 'Montserrat-Regular',
              fontSize: '9px',
              lineHeight: '18px',
              color: 'rgba(0, 0, 0, 0.87)',
            }}
          />
          <span>Instructions</span>
        </label>

        <SectionDivider
          setActiveSection={setActiveSection}
          noOfSections={noOfSections}
          setNoOfSections={setNoOfSections}
          setCustomSectionArray={setCustomSectionArray}
          customSectionArray={customSectionArray}
          totalQuestions={selectedQuestions.length}
          getSectionDetails={getSectionDetails}
          sectionQuestionDetails={sectionedQuestion}
        />

        <MarkingSchemeDecider
          setIsIndividualMarks={setIsIndividualMarks}
          marks={fullPaperMarks}
          setMarks={setFullPaperMarks}
          showSectionWise={activeSection !== 'No Sections'}
          sectionMarks={sectionMarks}
          updateSectionMarks={updateSectionMarks}
        />

        {activeSection === 'No Sections'
          ? selectedQuestions.map((question, index) => {
              return (
                <FinalQuestionCard
                  question={question}
                  index={index}
                  key={index} //eslint-disable-line
                  showMarks={isIndividualMarks}
                  updateQuestionMarks={updateQuestionMarks}
                />
              );
            })
          : sectionedQuestion.map((elem, i) => {
              return (
                <Card key={elem.name} className='m-1'>
                  <Row className='m-3' style={{ borderLeft: '3px solid rgba(0, 0, 0, 0.84)' }}>
                    <Col xs={5} className='Homework__finalSection p-1'>
                      Section {i + 1} - {elem.name}
                    </Col>
                    <Col xs={7} className='Homework__finalSectionSmall text-right' style={{}}>
                      Total Questions: {elem.questions.length}
                    </Col>
                  </Row>
                  {elem.questions.map((question, index) => {
                    return (
                      <FinalQuestionCard
                        question={question}
                        index={index}
                        key={index} //eslint-disable-line
                        showMarks={isIndividualMarks}
                        updateQuestionMarks={updateQuestionMarks}
                        sectionName={elem.name}
                      />
                    );
                  })}
                </Card>
              );
            })}
      </Card>
      {!history.location.state && (
        <Row className='justify-content-center my-3' onClick={() => goToAssigner()}>
          <Button variant='customPrimary'>Next</Button>
        </Row>
      )}
    </>
  );
};

const mapStateToProps = (state) => ({
  selectedQuestionArray: getSelectedQuestionArray(state),
  testName: getTestName(state),
  testId: getTestId(state),
  clientUserId: getClientUserId(state),
});

const mapDispatchToProps = (dispatch) => {
  return {
    setTestClassSubjectToStore: (payload) => {
      dispatch(homeworkActions.setTestClassSubjectToStore(payload));
    },

    setTestNameToStore: (payload) => {
      dispatch(homeworkActions.setTestNameToStore(payload));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PreviewQuestions);

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
  testName: PropTypes.string.isRequired,
  testId: PropTypes.number.isRequired,
  clientUserId: PropTypes.number.isRequired,
  setTestClassSubjectToStore: PropTypes.func.isRequired,
  setTestNameToStore: PropTypes.func.isRequired,
};
