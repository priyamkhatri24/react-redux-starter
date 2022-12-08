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
    removeAll,
  } = props;
  const [selectedBatches, setSelectedBatches] = useState([...selectBatches]);
  const [selectedBatchesId, setSelectedBatchesId] = useState(
    selectedBatches.map((ele) => ele.client_batch_id),
  );
  const [selectAllStudents, setSelectAllStudents] = useState(false);
  const [allBatches, setAllBatches] = useState([...batches]);
  const [removedBatches, setRemovedBatches] = useState([]);
  const [searchString, setSearchString] = useState('');

  const batchesLength = useRef(0);

  // useEffect(() => {
  //   const actualBatches = allBatches.filter(
  //     (ele) => !selectedBatchesId.includes(ele.client_batch_id),
  //   );
  //   setAllBatches(actualBatches);
  // }, []);

  useEffect(() => {
    console.log(batches);

    if (batchesLength.current !== batches.length) {
      setAllBatches(batches.filter((batch) => !selectedBatches.includes(batch)));
      batchesLength.current = batches.length;
    }
  }, [batches]);

  useEffect(() => {
    if (isStudentFee) {
      setAllBatches(batches.filter((batch) => !selectedBatches.includes(batch)));
    }
  }, [isStudentFee, batches]);

  useEffect(() => {
    if (sendBoth) getSelectedBatches(allBatches, selectedBatches, removedBatches);
    else getSelectedBatches(selectedBatches);
  }, [selectedBatches, getSelectedBatches, allBatches, sendBoth]);

  const selectBatch = (elem) => {
    // const batchess = allBatches.filter((e) => e.client_batch_id !== elem.client_batch_id);
    const batchess = [...allBatches];
    const newRemoved = removedBatches.filter(
      (batch) => batch.client_batch_id !== elem.client_batch_id,
    );
    const index = batchess.findIndex((e) => e.client_batch_id === elem.client_batch_id);
    batchess.splice(index, 1);
    setAllBatches(batchess);
    setRemovedBatches(newRemoved);
    setSelectedBatches((prevstate) => [...prevstate, elem]);
  };

  const removeBatch = (elem) => {
    const newRemoved = [...removedBatches];
    newRemoved.push(elem);
    setRemovedBatches(newRemoved);
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
      setSelectedBatches(() => [...batches]);
      setAllBatches([]);
    } else {
      setAllBatches(() => [...batches]);
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
        className='m-auto'
        label='Select All'
        name='selectAll'
      />
      <Row className='Batches py-3'>
        <Col xs={6} className='text-center'>
          <h6 className='mb-4'>{title}</h6>
          <div className='Batches__totalBatches'>
            <label
              style={{ width: '90%' }}
              htmlFor='Batches'
              className='d-flex has-float-label my-2 mx-3'
            >
              <input
                className='form-control'
                name='Batches'
                type='text'
                placeholder={`Search ${title}`}
                onChange={(e) => setSearchString(e.target.value)}
                value={searchString}
              />
              <span
                role='button'
                tabIndex={-1}
                onKeyDown={(e) => e.target.previousSibling.focus()}
                onClick={(e) => e.target.previousSibling.focus()}
              >
                Search {title}
              </span>
            </label>
            {allBatches.length > 0 &&
              allBatches
                .filter((ele) => {
                  if (title === 'Courses') {
                    console.log(ele);
                    return ele.course_title.includes(searchString?.toLowerCase());
                  }
                  return ele.batch_name.toLowerCase().includes(searchString?.toLowerCase());
                })
                .map((elem) => {
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
  removeAll: PropTypes.func,
};

BatchesSelector.defaultProps = {
  sendBoth: false,
  isStudentFee: false,
  removeAll: () => {},
};
