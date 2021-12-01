import React, { useState, useEffect } from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import PropTypes from 'prop-types';
import MathJax from 'react-mathjax-preview';

const PreviewCkeditor = (props) => {
  const { question, solution, options, questionImage, solutionImage, type, answerText } = props;

  const [qType, setQType] = useState('');

  useEffect(() => {
    setQType(type);
    console.log(type, 'typeFromPreview');
  }, [type]);

  return (
    <div
      style={{
        border: '1px solid rgba(0,0,0,0.125)',
        padding: '10px',
      }}
      className='mobileMargin Homework__selectCard prvm-0 mb-3 text-left'
    >
      <h1 className='Homework__options text-center'>Preview</h1>

      <h3 className='Homework__options'>Question</h3>
      <div className='d-flex mb-3 Homework__questionHeading'>
        {/* <MathJax math={String.raw`${question}`} /> */}
        {question}
      </div>
      {questionImage && <img src={questionImage} alt='question ' className='img-fluid m-1' />}

      {qType !== 'subjective' ? (
        <>
          <h3 className='Homework__options'>Options</h3>
          {options.map((e) => {
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
                      : null}
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
                    {e.image && (
                      <img
                        src={e.image}
                        alt='option'
                        className='img-fluid m-1'
                        width='70'
                        height='70'
                      />
                    )}
                  </Col>
                ) : null}
              </Row>
            );
          })}
        </>
      ) : null}
      {qType === 'subjective' ? (
        <>
          <h3 className='Homework__options'>Answer</h3>
          <div className='d-flex Homework__questionHeading mb-3'>
            {/* <MathJax math={String.raw`${solution}`} /> */}
            {answerText}
          </div>
        </>
      ) : null}
      <h3 className='Homework__options'>Solution</h3>
      <div className='d-flex Homework__questionHeading'>
        {/* <MathJax math={String.raw`${solution}`} /> */}
        {solution}
      </div>
      {solutionImage && <img src={solutionImage} alt='solution' className='img-fluid m-1' />}
    </div>
  );
};

export default PreviewCkeditor;

PreviewCkeditor.propTypes = {
  question: PropTypes.string.isRequired,
  solution: PropTypes.string.isRequired,
  options: PropTypes.instanceOf(Array).isRequired,
  questionImage: PropTypes.string.isRequired,
  solutionImage: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  answerText: PropTypes.string.isRequired,
};
