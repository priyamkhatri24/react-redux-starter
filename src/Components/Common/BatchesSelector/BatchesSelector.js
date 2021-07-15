import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import './BatchesSelector.scss';

export const BatchesSelector = (props) => {
  const {
    batches,
    getSelectedBatches,
    title,
    selectBatches,
    sendBoth,
    isStudentFee,
    search,
  } = props;
  const [selectedBatches, setSelectedBatches] = useState([...selectBatches]);
  const [selectAllStudents, setSelectAllStudents] = useState(false);
  const [allBatches, setAllBatches] = useState([...batches]);

  const batchesLength = useRef(0);

  useEffect(() => {
    console.log(batches);
    if (batchesLength.current !== batches.length) {
      setAllBatches(batches);
      batchesLength.current = batches.length;
    }
  }, [batches]);

  useEffect(() => {
    if (isStudentFee) {
      setAllBatches(batches);
    }
  }, [isStudentFee, batches]);

  useEffect(() => {
    if (sendBoth) getSelectedBatches(allBatches, selectedBatches);
    else getSelectedBatches(selectedBatches);
  }, [selectedBatches, getSelectedBatches, allBatches, sendBoth]);

  const selectBatch = (elem) => {
    const batchess = [...allBatches];
    const index = batchess.findIndex((e) => e.client_batch_id === elem.client_batch_id);
    batchess.splice(index, 1);
    setAllBatches(batchess);
    setSelectedBatches((prevstate) => [...prevstate, elem]);
  };

  const removeBatch = (elem) => {
    const batchess = [...allBatches];
    const index = selectedBatches.findIndex((e) => e.client_batch_id === elem.client_batch_id);
    batchess.push(elem);
    setAllBatches(batchess);
    setSelectedBatches((prevstate) => [
      ...prevstate.slice(0, index),
      ...prevstate.slice(index + 1),
    ]);
  };

  const selectAll = (val) => {
    console.log(val);
    if (val) {
      setSelectedBatches((prev) => [...prev, ...batches]);
      setAllBatches([]);
    } else {
      const batchess = [...selectedBatches];
      setAllBatches(batchess);
      setSelectedBatches([]);
    }
    setSelectAllStudents(val);
  };

  return (
    <>
      <Form.Check
        type='checkbox'
        checked={selectAllStudents}
        onChange={(e) => selectAll(!selectAllStudents)}
        className='my-auto ml-1'
        label='Select All'
        name='selectAll'
        style={{ textAlign: 'center' }}
      />
      <Row className='Batches py-3'>
        <Col xs={6} className='text-center'>
          <h6 className='mb-4'>{title}</h6>
          <div className='Batches__totalBatches'>
            {allBatches.length > 0 &&
              allBatches.map((elem) => {
                return (
                  <Row
                    className='justify-content-start mb-1 mx-3'
                    key={`elem${elem.client_batch_id}${elem.batch_name}`}
                    style={
                      Object.prototype.hasOwnProperty.call(elem, 'dontShow') && elem.dontShow
                        ? { display: 'none' }
                        : {}
                    }
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
                <Button
                  variant='customLightBlue'
                  onClick={() => removeBatch(elem)}
                  style={isStudentFee && elem.is_fee === 'true' ? { opacity: '0.6' } : {}}
                >
                  {elem.batch_name}
                </Button>
              </Row>
            );
          })}
        </Col>
      </Row>
    </>
  );
};

BatchesSelector.propTypes = {
  getSelectedBatches: PropTypes.func.isRequired,
  selectBatches: PropTypes.instanceOf(Array).isRequired,
  batches: PropTypes.instanceOf(Array).isRequired,
  title: PropTypes.string.isRequired,
  sendBoth: PropTypes.bool,
  isStudentFee: PropTypes.bool,
  search: PropTypes.bool,
};

BatchesSelector.defaultProps = {
  sendBoth: false,
  isStudentFee: false,
  search: false,
};
