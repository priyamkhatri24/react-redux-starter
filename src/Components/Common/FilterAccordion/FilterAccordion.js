import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import CloseIcon from '@material-ui/icons/Close';
import { useAccordionToggle } from 'react-bootstrap/AccordionToggle';

const CustomFilter = React.forwardRef(({ children, eventKey }, ref) => {
  const decoratedOnClick = useAccordionToggle(eventKey, () => console.log('toggle clicked'));
  return (
    <button type='button' style={{ display: 'none' }} ref={ref} onClick={decoratedOnClick}>
      {children}
    </button>
  );
});

export const FilterAccordion = (props) => {
  const trigger = useRef(null);
  const {
    filters,
    isToggle,
    addFilter,
    removeFilter,
    currentTab,
    addBatchFilter,
    removeBatchFilter,
  } = props;
  const [currentClass, setCurrentClass] = useState({});
  const [currentSubject, setCurrentSubject] = useState({});
  const [currentBatch, setCurrentBatch] = useState({});
  const [currentType, setCurrentType] = useState({});
  const [currentStatus, setCurrentStatus] = useState({});

  useEffect(() => {
    if (isToggle) {
      trigger.current.click();
    }
  }, [isToggle]);

  const select = (type, e) => {
    switch (type) {
      case 'class':
        setCurrentClass(e);
        currentTab === 'Users' ? addFilter(type, e.class_id) : addBatchFilter(type, e.class_id);
        break;
      case 'batch':
        setCurrentBatch(e);
        addFilter(type, e.client_batch_id);

        break;
      case 'role':
        setCurrentType(e);
        addFilter(type, e.role_id);
        break;
      case 'status':
        setCurrentStatus(e);
        addFilter(type, e.value);
        break;
      case 'subject':
        setCurrentSubject(e);
        addBatchFilter(type, e.subject_id);
        break;
      default:
        console.log('hello');
    }
  };

  const remove = (type) => {
    switch (type) {
      case 'class':
        setCurrentClass({});
        break;
      case 'batch':
        setCurrentBatch({});
        break;
      case 'role':
        setCurrentType({});
        break;
      case 'status':
        setCurrentStatus({});
        break;
      case 'subject':
        setCurrentSubject({});
        break;
      default:
        console.log('hello');
    }
    currentTab === 'Users' ? removeFilter(type) : removeBatchFilter(type);
  };

  return (
    <Accordion>
      <CustomFilter eventKey='0' ref={trigger}>
        S/D - Crafted with lub by SD
      </CustomFilter>
      <Card style={{ border: 'none', backgroundColor: 'rgba(241, 249, 255, 1)' }}>
        <Accordion.Collapse eventKey='0'>
          <>
            {Object.keys(filters).length > 0 && (
              <Card.Body className='p-0'>
                <small className='text-left Homework__smallHeading mx-3 my-2'>Class</small>
                <Row className='mx-3'>
                  <section
                    className='Homework__scrollable'
                    style={{ backgroundColor: 'rgba(241, 249, 255, 1)' }}
                  >
                    {Object.keys(currentClass).length === 0 &&
                      filters.class.map((e) => {
                        return (
                          <div
                            key={e.class_id}
                            className='Homework__questionBubble'
                            onClick={() => select('class', e)}
                            onKeyDown={() => select('class', e)}
                            role='button'
                            tabIndex='-1'
                            style={{
                              backgroundColor: 'rgba(241, 249, 255, 1)',
                              color: 'rgba(112, 112, 112, 1)',
                              border: '1px solid rgba(112, 112, 112, 1)',
                            }}
                          >
                            {e.class_name}
                          </div>
                        );
                      })}

                    {Object.keys(currentClass).length > 0 && (
                      <>
                        <div
                          className='Homework__questionBubble'
                          style={{ backgroundColor: '#fff', color: '#000' }}
                        >
                          {currentClass.class_name}
                        </div>
                        <div
                          className='Homework__questionBubble'
                          onClick={() => remove('class')}
                          onKeyDown={() => remove('class')}
                          role='button'
                          tabIndex='-1'
                          style={{
                            backgroundColor: 'rgba(241, 249, 255, 1)',
                            color: '#000',
                            border: '1px solid rgba(112, 112, 112, 1)',
                          }}
                        >
                          <CloseIcon />
                        </div>
                      </>
                    )}
                  </section>
                </Row>
                <hr />
                {currentTab === 'Users' ? (
                  <>
                    <small className='text-left Homework__smallHeading mx-3 my-2'>Batch</small>
                    <Row className='mx-3'>
                      <section
                        className='Homework__scrollable'
                        style={{ backgroundColor: 'rgba(241, 249, 255, 1)' }}
                      >
                        {Object.keys(currentBatch).length === 0 &&
                          filters.batch.map((e) => {
                            return (
                              <div
                                key={e.client_batch_id}
                                className='Homework__subjectBubble Homework__selected'
                                onClick={() => select('batch', e)}
                                onKeyDown={() => select('batch', e)}
                                role='button'
                                tabIndex='-1'
                                style={{
                                  backgroundColor: 'rgba(241, 249, 255, 1)',
                                  color: 'rgba(112, 112, 112, 1)',
                                  border: '1px solid rgba(112, 112, 112, 1)',
                                  height: '30px',
                                }}
                              >
                                {e.batch_name}
                              </div>
                            );
                          })}

                        {Object.keys(currentBatch).length > 0 && (
                          <>
                            <div
                              className='Homework__subjectBubble Homework__selected'
                              style={{ backgroundColor: '#fff', color: '#000' }}
                            >
                              {currentBatch.batch_name}
                            </div>
                            <div
                              className='Homework__questionBubble'
                              onClick={() => remove('batch')}
                              onKeyDown={() => remove('batch')}
                              role='button'
                              tabIndex='-1'
                              style={{
                                backgroundColor: 'rgba(241, 249, 255, 1)',
                                color: '#000',
                                border: '1px solid rgba(112, 112, 112, 1)',
                              }}
                            >
                              <CloseIcon />
                            </div>
                          </>
                        )}
                      </section>
                    </Row>
                    <hr />
                    <small className='text-left Homework__smallHeading mx-3 my-2'>Type</small>

                    <Row className='mx-3'>
                      <section
                        className='Homework__scrollable'
                        style={{ backgroundColor: 'rgba(241, 249, 255, 1)' }}
                      >
                        {Object.keys(currentType).length === 0 &&
                          filters.role.map((e) => {
                            return (
                              <div
                                key={e.role_id}
                                className='Homework__subjectBubble Homework__selected'
                                onClick={() => select('role', e)}
                                onKeyDown={() => select('role', e)}
                                role='button'
                                tabIndex='-1'
                                style={{
                                  backgroundColor: 'rgba(241, 249, 255, 1)',
                                  color: 'rgba(112, 112, 112, 1)',
                                  border: '1px solid rgba(112, 112, 112, 1)',
                                  height: '30px',
                                }}
                              >
                                {e.role}
                              </div>
                            );
                          })}

                        {Object.keys(currentType).length > 0 && (
                          <>
                            <div
                              className='Homework__subjectBubble Homework__selected'
                              style={{ backgroundColor: '#fff', color: '#000' }}
                            >
                              {currentType.role}
                            </div>
                            <div
                              className='Homework__questionBubble'
                              onClick={() => remove('role')}
                              onKeyDown={() => remove('role')}
                              role='button'
                              tabIndex='-1'
                              style={{
                                backgroundColor: 'rgba(241, 249, 255, 1)',
                                color: '#000',
                                border: '1px solid rgba(112, 112, 112, 1)',
                              }}
                            >
                              <CloseIcon />
                            </div>
                          </>
                        )}
                      </section>
                    </Row>
                    <hr />
                    <small className='text-left Homework__smallHeading mx-3 my-2'>Status</small>

                    <Row className='mx-3'>
                      <section
                        className='Homework__scrollable'
                        style={{ backgroundColor: 'rgba(241, 249, 255, 1)' }}
                      >
                        {Object.keys(currentStatus).length === 0 &&
                          filters.status.map((e) => {
                            return (
                              <div
                                key={e.key}
                                className='Homework__subjectBubble Homework__selected'
                                onClick={() => select('status', e)}
                                onKeyDown={() => select('status', e)}
                                role='button'
                                tabIndex='-1'
                                style={{
                                  backgroundColor: 'rgba(241, 249, 255, 1)',
                                  color: 'rgba(112, 112, 112, 1)',
                                  border: '1px solid rgba(112, 112, 112, 1)',
                                  height: '30px',
                                }}
                              >
                                {e.key}
                              </div>
                            );
                          })}

                        {Object.keys(currentStatus).length > 0 && (
                          <>
                            <div
                              className='Homework__subjectBubble Homework__selected'
                              style={{ backgroundColor: '#fff', color: '#000' }}
                            >
                              {currentStatus.key}
                            </div>
                            <div
                              className='Homework__questionBubble'
                              onClick={() => remove('status')}
                              onKeyDown={() => remove('status')}
                              role='button'
                              tabIndex='-1'
                              style={{
                                backgroundColor: 'rgba(241, 249, 255, 1)',
                                color: '#000',
                                border: '1px solid rgba(112, 112, 112, 1)',
                              }}
                            >
                              <CloseIcon />
                            </div>
                          </>
                        )}
                      </section>
                    </Row>
                  </>
                ) : (
                  <>
                    <small className='text-left Homework__smallHeading mx-3 my-2'>Subject</small>

                    <Row className='mx-3'>
                      <section
                        className='Homework__scrollable'
                        style={{ backgroundColor: 'rgba(241, 249, 255, 1)' }}
                      >
                        {Object.keys(currentSubject).length === 0 &&
                          filters.subject.map((e) => {
                            return (
                              <div
                                key={e.subject_id}
                                className='Homework__subjectBubble Homework__selected'
                                onClick={() => select('subject', e)}
                                onKeyDown={() => select('subject', e)}
                                role='button'
                                tabIndex='-1'
                                style={{
                                  backgroundColor: 'rgba(241, 249, 255, 1)',
                                  color: 'rgba(112, 112, 112, 1)',
                                  border: '1px solid rgba(112, 112, 112, 1)',
                                  height: '30px',
                                }}
                              >
                                {e.subject_name}
                              </div>
                            );
                          })}

                        {Object.keys(currentSubject).length > 0 && (
                          <>
                            <div
                              className='Homework__subjectBubble Homework__selected'
                              style={{ backgroundColor: '#fff', color: '#000' }}
                            >
                              {currentSubject.subject_name}
                            </div>
                            <div
                              className='Homework__questionBubble'
                              onClick={() => remove('subject')}
                              onKeyDown={() => remove('subject')}
                              role='button'
                              tabIndex='-1'
                              style={{
                                backgroundColor: 'rgba(241, 249, 255, 1)',
                                color: '#000',
                                border: '1px solid rgba(112, 112, 112, 1)',
                              }}
                            >
                              <CloseIcon />
                            </div>
                          </>
                        )}
                      </section>
                    </Row>
                  </>
                )}
                <hr />
              </Card.Body>
            )}
          </>
        </Accordion.Collapse>
      </Card>
    </Accordion>
  );
};

FilterAccordion.propTypes = {
  filters: PropTypes.instanceOf(Object).isRequired,
  isToggle: PropTypes.number,
  addFilter: PropTypes.func.isRequired,
  removeFilter: PropTypes.func.isRequired,
  currentTab: PropTypes.string.isRequired,
  addBatchFilter: PropTypes.func.isRequired,
  removeBatchFilter: PropTypes.func.isRequired,
};

FilterAccordion.defaultProps = {
  isToggle: 0,
};

CustomFilter.propTypes = {
  children: PropTypes.instanceOf(Array).isRequired,
  eventKey: PropTypes.string.isRequired,
};
