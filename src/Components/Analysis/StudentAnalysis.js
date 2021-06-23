import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import { PageHeader } from '../Common';
import {
  getAnalysisAssignmentObject,
  getAnalysisSubjectArray,
  getAnalysisTestObject,
} from '../../redux/reducers/analysis.reducer';
import ingeniumLogoRound from '../../assets/images/Analysis/logoRound.png';
import './Analysis.scss';
import { AnalysisCards } from '../Common/ScrollableCards/AnalysisCards';
import FinalQuestionCard from '../HomeWorkCreator/FinalQuestionCard';
import '../HomeWorkCreator/HomeWorkCreator.scss';

const StudentAnalysis = (props) => {
  const { analysisTestObject, analysisAssignmentObject, analysisSubjectArray } = props;

  const [scrollableData, setScrollableData] = useState([]);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const data = [
      { key: 1, name: 'Attempted Questions', value: analysisTestObject.analysis.attempted },
      { key: 2, name: 'Total Questions', value: analysisTestObject.analysis.total_questions },
      { key: 3, name: 'Correct Answers', value: analysisTestObject.analysis.correct_questions },
      { key: 4, name: 'Incorrect Answers', value: analysisTestObject.analysis.incorrect_questions },
      { key: 5, name: 'Positive Marks', value: analysisTestObject.analysis.right },
      { key: 6, name: 'Negative Marks', value: analysisTestObject.analysis.wrong },
      { key: 7, name: 'Percentage', value: analysisTestObject.analysis.percentage },
    ];
    setScrollableData(data);

    const subjects = Object.keys(analysisTestObject.result);
    const questionsOfSubjects = Object.values(analysisTestObject.result);

    const questionData = [];

    for (let i = 0; i < subjects.length; i++) {
      const obj = { key: i + 1, name: subjects[i], value: questionsOfSubjects[i] };
      questionData.push(obj);
    }
    console.log(questionData);

    setQuestions(questionData);
  }, [analysisTestObject]);

  return (
    <>
      <PageHeader title={analysisTestObject.name} />
      <div style={{ marginTop: '4rem' }}>
        <h2 className='text-center mx-3 Analysis__studentHeading'>
          {analysisAssignmentObject.test_name}
        </h2>
        <h6
          className='text-center mx-3 Analysis__studentSubHeading'
          style={
            analysisTestObject.analysis.test_type === 'demo test'
              ? { color: '#ffff00' }
              : analysisTestObject.analysis.test_type === 'live test'
              ? { color: 'rgba(255, 0, 0, 0.87)' }
              : { color: 'rgba(58, 255, 0, 0.87)' }
          }
        >
          {analysisTestObject.analysis.test_type}
        </h6>
        <div className='m-5' style={{ position: 'relative' }}>
          <img src={ingeniumLogoRound} alt='ingeniumLogoRound' className='img-fluid' />
          <div style={{ position: 'absolute', top: '15%', right: '35%' }}>
            <p
              className='Analysis__studentMarks mb-0'
              style={{ borderBottom: '3px solid rgba(38, 153, 251, 1)' }}
            >
              {analysisTestObject.analysis.total_marks}
            </p>
            <p className='Analysis__studentMarks'>{analysisTestObject.analysis.maximum_marks}</p>
          </div>
        </div>

        <Row
          className='mx-4 p-2 mb-2'
          style={{
            boxShadow: ' 0px 1px 3px 0px rgba(0, 0, 0, 0.38)',
            border: '1px solid rgba(0, 0, 0, 0.38)',
            borderRadius: '10px',
          }}
        >
          <Col xs={2} className='text-center my-auto' style={{ color: 'rgba(0, 0, 0, 0.38)' }}>
            <PeopleAltIcon />
          </Col>
          <Col
            xs={7}
            className='text-center Analysis__studentSubHeading my-auto'
            style={{ fontSize: '14px' }}
          >
            Students Appeared
          </Col>
          <Col xs={3} className='text-center my-auto Analysis__noOfStudents'>
            {analysisAssignmentObject.total_submission}
          </Col>
        </Row>
        <AnalysisCards data={scrollableData} />

        <table className='table'>
          <thead>
            <tr>
              <th scope='col' className='Analysis__tableHeading'>
                Analysis
              </th>
              {analysisSubjectArray.length &&
                analysisSubjectArray.map((elem) => {
                  return (
                    <th scope='col' className='Analysis__tableHeading text-center'>
                      {elem.subject_name}
                    </th>
                  );
                })}
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope='row' className='Analysis__tableHeading'>
                Marks Obtained
              </th>
              {analysisSubjectArray.length &&
                analysisSubjectArray.map((elem) => {
                  return <td className='text-center Analysis__tableData'>{elem.total_marks}</td>;
                })}
            </tr>
            <tr>
              <th scope='row' className='Analysis__tableHeading'>
                Total Questions
              </th>
              {analysisSubjectArray.length &&
                analysisSubjectArray.map((elem) => {
                  return (
                    <td className='text-center Analysis__tableData'>{elem.total_questions}</td>
                  );
                })}
            </tr>
            <tr>
              <th scope='row' className='Analysis__tableHeading'>
                Correct Answers
              </th>
              {analysisSubjectArray.length &&
                analysisSubjectArray.map((elem) => {
                  return (
                    <td className='text-center Analysis__tableData'>{elem.correct_questions}</td>
                  );
                })}
            </tr>
            <tr>
              <th scope='row' className='Analysis__tableHeading'>
                Incorrect Answers
              </th>
              {analysisSubjectArray.length &&
                analysisSubjectArray.map((elem) => {
                  return (
                    <td className='text-center Analysis__tableData'>{elem.incorrect_questions}</td>
                  );
                })}
            </tr>
            <tr>
              <th scope='row' className='Analysis__tableHeading'>
                Not Attempted
              </th>
              {analysisSubjectArray.length &&
                analysisSubjectArray.map((elem) => {
                  return <td className='text-center Analysis__tableData'>{elem.left_questions}</td>;
                })}
            </tr>
          </tbody>
        </table>

        {questions.length &&
          questions.map((elem) => {
            return (
              <div key={elem.key}>
                <h3 className='m-3 Analysis__studentHeading'>{elem.name} Section</h3>
                {elem.value.map((question, index) => {
                  return (
                    <FinalQuestionCard
                      question={question}
                      index={index}
                      // eslint-disable-next-line
                      key={index}
                      isViewOnly
                      isAnalysis
                      language={analysisAssignmentObject.language_type}
                    />
                  );
                })}
              </div>
            );
          })}
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  analysisAssignmentObject: getAnalysisAssignmentObject(state),
  analysisTestObject: getAnalysisTestObject(state),
  analysisSubjectArray: getAnalysisSubjectArray(state),
});

export default connect(mapStateToProps)(StudentAnalysis);

StudentAnalysis.propTypes = {
  analysisAssignmentObject: PropTypes.instanceOf(Object).isRequired,
  analysisTestObject: PropTypes.instanceOf(Object).isRequired,
  analysisSubjectArray: PropTypes.instanceOf(Array).isRequired,
};
