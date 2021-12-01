import React from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import PropTypes from 'prop-types';
import MathJax from 'react-mathjax-preview';

const PreviewCkeditor = (props) => {
  const { question, solution, options, questionImage, solutionImage } = props;

  return (
    <div
      style={{
        border: '1px solid rgba(0,0,0,0.125)',
        padding: '10px',
      }}
      className='mobileMargin Homework__selectCard prvm-0 mb-3 text-left'
    >
      <h1 className='Homework__preview text-center'>Preview</h1>

      <h3 className='Homework__previewHeading'>Question</h3>
      <div className='d-flex mb-3'>
        {/* <MathJax math={String.raw`${question}`} /> */}
        {question}
      </div>
      {questionImage && <img src={questionImage} alt='question ' className='img-fluid m-1' />}

      <h3 className='Homework__previewHeading'>Options</h3>
      {options.map((e) => {
        return (
          <Row className='Homework__previewText m-1 mb-3' key={e.value}>
            <Col xs={1}>
              <p>{e.value}.</p>
            </Col>
            <Col xs={6}>
              <div>
                {/* <MathJax math={String.raw`${e.text}`} /> */}
                {e.text}
              </div>
            </Col>
            <Col xs={4}>
              {e.image && (
                <img src={e.image} alt='option' className='img-fluid m-1' width='70' height='70' />
              )}
            </Col>
          </Row>
        );
      })}

      <h3 className='Homework__previewHeading'>Solution</h3>
      <div className='d-flex'>
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
};
