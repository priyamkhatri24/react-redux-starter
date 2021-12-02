import React from 'react';
import PropTypes from 'prop-types';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { connect } from 'react-redux';
import './Analysis.scss';
import { apiValidation, get } from '../../Utilities';
import { analysisActions } from '../../redux/actions/analysis.action';

const AnalysisTestCard = (props) => {
  const {
    name,
    date,
    maxMarks,
    marksObtained,
    history,
    setAnalysisSubjectArrayToStore,
    setAnalysisTestObjectToStore,
    testId,
    clientUserId,
    language,
  } = props;

  const goToStudentAnalysis = (elem) => {
    console.log(name);
    const payload = {
      test_id: testId,
      client_user_id: clientUserId,
    };
    const subjectAnalysis = get(payload, '/getSubjectAnalysisOfTestForStudentLatest');

    const testAnalysis = get(payload, '/getTestAnalysisForStudentLatest');

    Promise.all([subjectAnalysis, testAnalysis]).then((res) => {
      const subjects = apiValidation(res[0]);
      console.log(res, 'promiseArrayTestAnalysis');
      setAnalysisSubjectArrayToStore(subjects);
      setAnalysisTestObjectToStore({ ...res[1], name });
      console.log(subjects, 'aaaaaa');
      history.push({ pathname: '/analysis/studentanalysis', state: { language, name } });
    });
  };

  return (
    <Card className='pt-2 Analysis__testCard' style={{ borderRadius: '10px' }}>
      <p className='Analysis__testCardBigHeading m-2'>{name}</p>
      <Row className='pt-2 mx-1'>
        <Col xs={4} className='Analysis__testCardHeading'>
          Date
        </Col>
        <Col xs={4} className='text-center Analysis__testCardHeading'>
          Maximum Marks
        </Col>
        <Col xs={4} className='text-right Analysis__testCardHeading'>
          Marks Obtained
        </Col>
      </Row>
      <Row className='p-2 mx-1'>
        <Col xs={4} className='Analysis__testCardDetails'>
          {date}
        </Col>
        <Col xs={4} className='text-center Analysis__testCardDetails'>
          {maxMarks}
        </Col>
        <Col xs={4} className='text-right Analysis__testCardDetails'>
          {marksObtained}
        </Col>
      </Row>
      <Row
        className='m-0 justify-content-center'
        style={{
          backgroundColor: 'var(--primary-blue)',
          color: '#fff',
          fontFamily: 'Montserrat-Medium',
          borderRadius: '0 0px 10px 10px',
        }}
        onClick={() => goToStudentAnalysis()}
      >
        View Details
      </Row>
    </Card>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    setAnalysisTestObjectToStore: (payload) => {
      dispatch(analysisActions.setAnalysisTestObjectToStore(payload));
    },
    setAnalysisSubjectArrayToStore: (payload) => {
      dispatch(analysisActions.setAnalysisSubjectArrayToStore(payload));
    },
  };
};

export default connect(null, mapDispatchToProps)(AnalysisTestCard);

AnalysisTestCard.propTypes = {
  name: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  maxMarks: PropTypes.string.isRequired,
  marksObtained: PropTypes.string.isRequired,
  history: PropTypes.instanceOf(Object).isRequired,
  setAnalysisTestObjectToStore: PropTypes.func.isRequired,
  setAnalysisSubjectArrayToStore: PropTypes.func.isRequired,
  clientUserId: PropTypes.number.isRequired,
  testId: PropTypes.number.isRequired,
  language: PropTypes.string.isRequired,
};
