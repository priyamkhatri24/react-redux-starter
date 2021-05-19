import React from 'react';
import PropTypes from 'prop-types';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './Analysis.scss';

const AnalysisTestCard = (props) => {
  const { name, date, maxMarks, marksObtained } = props;
  return (
    <Card className='m-2 pt-2' style={{ borderRadius: '10px' }}>
      <p className='Analysis__testCardBigHeading'>{name}</p>
      <Row className='p-2'>
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
      <Row className='p-2'>
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
      >
        View Details
      </Row>
    </Card>
  );
};

export default AnalysisTestCard;

AnalysisTestCard.propTypes = {
  name: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  maxMarks: PropTypes.string.isRequired,
  marksObtained: PropTypes.string.isRequired,
};
