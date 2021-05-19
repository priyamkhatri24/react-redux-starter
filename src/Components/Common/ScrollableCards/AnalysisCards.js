import React from 'react';
import PropTypes from 'prop-types';
import Row from 'react-bootstrap/Row';
import './ScrollableCards.scss';

export const AnalysisCards = (props) => {
  const { data } = props;

  return (
    <section className='Scrollable__card align-items-center' style={{ minHeight: '130px' }}>
      {data.length &&
        data.map((elem) => {
          return (
            <Row
              className='justify-content-center Scrollable__cardContent text-center'
              style={{ minWidth: '185px' }}
              key={elem.key}
            >
              <div className='Scrollable__analysisHeading mt-3 p-2'>{elem.name}</div>
              <div className='Scrollable__analysisValue p-2' style={{ marginTop: '6px' }}>
                {elem.value}
              </div>
            </Row>
          );
        })}
    </section>
  );
};

AnalysisCards.propTypes = {
  data: PropTypes.instanceOf(Array).isRequired,
};
