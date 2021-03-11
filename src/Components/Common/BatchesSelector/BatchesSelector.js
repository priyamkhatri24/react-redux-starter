import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import './BatchesSelector.scss';

export const BatchesSelector = (props) => {
  const { batches, getSelectedBatches, title, selectBatches, sendBoth } = props;
  const [selectedBatches, setSelectedBatches] = useState([...selectBatches]);

  useEffect(() => {
    if (sendBoth) getSelectedBatches(batches, selectedBatches);
    else getSelectedBatches(selectedBatches);
  }, [selectedBatches, getSelectedBatches, batches, sendBoth]);

  const selectBatch = (elem) => {
    const index = batches.findIndex((e) => e.client_batch_id === elem.client_batch_id);
    batches.splice(index, 1);
    setSelectedBatches((prevstate) => [...prevstate, elem]);
  };

  const removeBatch = (elem) => {
    const index = selectedBatches.findIndex((e) => e.client_batch_id === elem.client_batch_id);
    batches.push(elem);
    setSelectedBatches((prevstate) => [
      ...prevstate.slice(0, index),
      ...prevstate.slice(index + 1),
    ]);
  };

  return (
    <Row className='Batches py-3'>
      <Col xs={6} className='text-center'>
        <h6 className='mb-4'>{title}</h6>
        <div className='Batches__totalBatches'>
          {batches.map((elem) => {
            return (
              <Row
                className='justify-content-start mb-1 mx-3'
                key={`elem${elem.client_batch_id}${elem.batch_name}`}
              >
                <Button variant='batchCustomNotSelected' onClick={() => selectBatch(elem)}>
                  {elem.batch_name}
                </Button>
              </Row>
            );
          })}
        </div>
      </Col>
      <Col xs={6} className='text-center'>
        <h6 className='mb-4'>{selectedBatches.length} Selected</h6>
        {selectedBatches.map((elem) => {
          return (
            <Row
              className='justify-content-start mb-1 mx-3'
              key={`e123${elem.client_batch_id}${elem.count}`}
            >
              <Button variant='customLightBlue' onClick={() => removeBatch(elem)}>
                {elem.batch_name}
              </Button>
            </Row>
          );
        })}
      </Col>
    </Row>
  );
};

BatchesSelector.propTypes = {
  getSelectedBatches: PropTypes.func.isRequired,
  selectBatches: PropTypes.instanceOf(Array).isRequired,
  batches: PropTypes.instanceOf(Array).isRequired,
  title: PropTypes.string.isRequired,
  sendBoth: PropTypes.bool,
};

BatchesSelector.defaultProps = {
  sendBoth: false,
};
