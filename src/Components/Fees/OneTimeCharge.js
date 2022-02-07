import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const OneTimeCharge = (props) => {
  const { tags, setTagAmount, setTagName, tagAmount, tagName, EditFeePlan, status, id } = props;
  const [showModal, setShowModal] = useState(false);
  const [showOtherTagName, setOtherTagName] = useState(false);
  const handleClose = () => setShowModal(false);

  return (
    <Card
      key={id}
      className='m-2 p-2'
      style={
        EditFeePlan && status !== 'due'
          ? {
              pointerEvents: 'none',
              backgroundColor: '#3AFF00',
              opacity: '0.26',
              margin: 0,
              boxShadow: '0px 1px 3px 0px rgba(0,0,0,0.16)',
              borderRadius: '10px',
            }
          : { boxShadow: '0px 1px 3px 0px rgba(0,0,0,0.16)', borderRadius: '10px' }
      }
    >
      <p className='Scrollable__recentlyUsed m-2'>
        {EditFeePlan ? tagName : 'One Time charge name'}
      </p>

      <Row className='m-2'>
        {/* eslint-disable */}
        <label
          onClick={() => setShowModal(true)}
          htmlFor='Enter Type'
          className='w-100 has-float-label my-auto'
        >
          <input
            className='form-control'
            name='Enter Type'
            type='text'
            placeholder='Enter Type (eg: Registration fee)'
            readOnly
            required
            value={tagName || ''}
            id='noBackGroundColor'
          />
          <span>Enter Type (eg: Registration fee)</span>
          <i
            className='LiveClasses__show'
            style={{
              position: 'absolute',
              top: '10%',
              right: '3%',
              color: 'rgba(0, 0, 0, 0.38)',
            }}
          >
            <ExpandMoreIcon />
          </i>
        </label>
      </Row>
      <label className='has-float-label mx-2 my-3'>
        <input
          className='form-control'
          name='Enter amount'
          type='number'
          placeholder='Enter amount'
          value={tagAmount}
          onChange={
            EditFeePlan
              ? (e) => setTagAmount(id, e.target.value)
              : (e) => setTagAmount(e.target.value)
          }
        />
        <span>Enter amount</span>
      </label>
      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <span className='Scrollable__recentlyUsed my-auto'>
            Please select the type of this one time charge.
          </span>
        </Modal.Header>
        <Modal.Body>
          {!showOtherTagName && (
            <>
              {tags.map((e) => {
                return (
                  <Card
                    key={e.tag_id}
                    style={{ borderRadius: '5px', border: '1px solid rgba(0, 0, 0, 0.12)' }}
                    className='p-1 m-1'
                    onClick={
                      EditFeePlan
                        ? () => {
                            setTagName(id, e.tag_name);
                            handleClose();
                          }
                        : () => {
                            setTagName(e.tag_name);
                            handleClose();
                          }
                    }
                  >
                    <span
                      style={{
                        fontSize: '14px',
                        lineHeight: '24px',
                        color: 'rgba(0, 0, 0, 0.87)',
                        fontFamily: 'Montserrat-Regular',
                      }}
                    >
                      {e.tag_name}
                    </span>
                  </Card>
                );
              })}

              <Button variant='boldText' onClick={() => setOtherTagName(true)}>
                Specify some other?
              </Button>
            </>
          )}
          {showOtherTagName && (
            <label className='has-float-label mx-2 my-3'>
              <input
                className='form-control'
                name='Enter Name'
                type='text'
                placeholder='Enter Name'
                value={tagName}
                onChange={
                  EditFeePlan
                    ? (e) => setTagName(id, e.target.value)
                    : (e) => setTagName(e.target.value)
                }
              />
              <span>Enter Name</span>
            </label>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant='boldTextSecondary' onClick={handleClose}>
            Cancel
          </Button>
          {showOtherTagName && (
            <Button variant='boldText' onClick={handleClose}>
              Done
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </Card>
  );
};

export default OneTimeCharge;

OneTimeCharge.propTypes = {
  tags: PropTypes.instanceOf(Array).isRequired,
  setTagAmount: PropTypes.func,
  setTagName: PropTypes.func,
  tagName: PropTypes.string.isRequired,
  tagAmount: PropTypes.string.isRequired,
  EditFeePlan: PropTypes.bool,
  status: PropTypes.string,
  id: PropTypes.number,
};

OneTimeCharge.defaultProps = {
  EditFeePlan: false,
  setTagAmount: () => {},
  setTagName: () => {},
  status: '',
  id: 0,
};
