import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Card from 'react-bootstrap/Card';
import { connect } from 'react-redux';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Row from 'react-bootstrap/Row';
import fromUnixTime from 'date-fns/fromUnixTime';
import format from 'date-fns/format';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import {
  getClientId,
  getClientUserId,
  getRoleArray,
} from '../../redux/reducers/clientUserId.reducer';
import { get, apiValidation } from '../../Utilities';
import { PageHeader, BatchesSelector } from '../Common';
import { createJitsiStream } from './LiveClasses.service';

import './LiveClasses.scss';

const LiveClasses = (props) => {
  const { clientUserId, roleArray, clientId } = props;
  const [batches, setBatches] = useState([]);
  const [adminBatches, setAdminBatches] = useState([]);
  const [selectedBatches, setSelectedBatches] = useState([]);
  const [duration, setDuration] = useState();
  const [showModal, setShowModal] = useState(false);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (roleArray.includes(3)) {
      const payload = {
        client_user_id: clientUserId,
      };
      get(payload, '/getBatchesOfTeacher').then((res) => {
        const result = apiValidation(res);
        setBatches(result);
      });
    }

    if (roleArray.includes(4)) {
      const payload = {
        client_user_id: clientUserId,
        client_id: clientId,
      };

      get(payload, '/getLiveStreamsForAdmin').then((res) => {
        const result = apiValidation(res);
        setAdminBatches(result);
      });
    }
  }, [roleArray, clientUserId, clientId]);

  const startLiveStream = (element) => {
    console.log(element);
    const durationArray = duration.split(':');
    const seconds = durationArray[0] * 3600 + durationArray[1] * 60 + durationArray[2];
    if (Number.isNaN(Number(seconds))) {
      alert('Please input the complete duration.');
      return;
    }
    console.log(seconds);
  };

  const handleClose = () => setShowModal(false);

  const getSelectedBatches = (payload) => {
    setSelectedBatches(payload);
    const extraBatchesString = payload.length > 1 ? ` +${(payload.length - 2).toString()}` : '';
    if (payload.length) {
      const inputString = payload.reduce((acc, elem, index) => {
        if (index < 1) {
          return `${acc + elem.batch_name},`;
        }
        if (index === 1) {
          return acc + elem.batch_name;
        }
        return acc;
      }, '');
      setInputValue(inputString + extraBatchesString);
    }
  };

  const setJitsiStream = () => {
    const durationArray = duration.split(':');
    const milliseconds =
      (durationArray[0] * 3600 + durationArray[1] * 60 + durationArray[2]) * 1000;
    const batchIdArray = JSON.stringify(selectedBatches.map((elem) => elem.client_batch_id));
    createJitsiStream(batchIdArray, milliseconds.toString(), clientId, clientUserId);
  };

  return (
    <div className='LiveClasses'>
      <PageHeader title='Live Stream' />
      <Card className='LiveClasses__Card mx-auto mt-5 p-3'>
        <label htmlFor='Select Batch' className='has-float-label my-auto'>
          <input
            className='form-control'
            name='Select Batch'
            type='text'
            placeholder='Select Batch'
            onClick={() => setShowModal(true)}
            readOnly
            value={inputValue}
          />
          <span>Select Batch</span>
          <i className='LiveClasses__show'>
            <ExpandMoreIcon />
          </i>
        </label>
        <label className='has-float-label my-auto' htmlFor='Duration'>
          <input
            className='form-control mt-4'
            name='Duration'
            type='time'
            step='1'
            placeholder='Duration'
            onChange={(e) => setDuration(e.target.value)}
          />
          <span className='mt-4'>Duration</span>
        </label>
      </Card>
      <Row className='justify-content-center mt-4 mt-lg-5'>
        <Button
          variant='customPrimary'
          size='sm'
          className='mr-2 mr-lg-5'
          onClick={() => setJitsiStream()}
        >
          Go Live Alpha!
        </Button>
        <Button variant='customPrimary' size='sm'>
          Go Live Beta!
        </Button>
      </Row>

      {adminBatches.length && (
        <div className='LiveClasses__adminInfo'>
          <h6 className='text-center my-4 my-md-5 LiveClasses__adminHeading'>
            Institute&apos;s other Live Classes
          </h6>

          {adminBatches.map((elem) => {
            return (
              <Card key={elem.stream_id} className='LiveClasses__Card mx-auto p-2 mb-3 mb-lg-5'>
                <div className='LiveClasses__adminCard p-2'>
                  <h6 className='LiveClasses__adminHeading mb-0'>
                    {elem.first_name} {elem.last_name} is streaming Live
                  </h6>
                  <p className='LiveClasses__adminCardTime mb-0'>
                    {format(fromUnixTime(elem.created_at), 'HH:mm MMM dd, yyyy')}
                  </p>

                  <p className='LiveClasses__adminDuration'>
                    Duration:{' '}
                    <span>
                      {`${Math.floor(elem.duration / 3600000)} hr ${Math.floor(
                        (elem.duration % 3600) / 60,
                      )} min `}
                    </span>
                  </p>

                  <p className='LiveClasses__adminBatches'>
                    Streaming In :{' '}
                    {elem.batch_array.map((e, i) => {
                      return (
                        <span key={`elem${e}`}>
                          {e}
                          {i < elem.batch_array.length - 1 ? ',' : ''}
                        </span>
                      );
                    })}
                  </p>
                  <Row className='justify-content-center mb-2 mb-lg-4'>
                    <Button variant='customPrimary' size='sm' onClick={() => startLiveStream(elem)}>
                      Attend Live Now!
                    </Button>
                  </Row>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Modal show={showModal} onHide={handleClose} centered>
        <BatchesSelector
          batches={batches}
          getSelectedBatches={(payload) => getSelectedBatches(payload)}
        />
      </Modal>
    </div>
  );
};

const mapStateToProps = (state) => ({
  clientId: getClientId(state),
  roleArray: getRoleArray(state),
  clientUserId: getClientUserId(state),
});

export default connect(mapStateToProps)(LiveClasses);

LiveClasses.propTypes = {
  clientId: PropTypes.number.isRequired,
  roleArray: PropTypes.instanceOf(Array).isRequired,
  clientUserId: PropTypes.number.isRequired,
};
