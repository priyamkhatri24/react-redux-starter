import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import { connect } from 'react-redux';
import { Button, Row } from 'react-bootstrap';
import { getClientId, getClientUserId } from '../../redux/reducers/clientUserId.reducer';
import { apiValidation, get } from '../../Utilities';
import FeeCarousel from './FeeCarousel';
import FeesTimeline from './FeesTimeline';
import FeeBatches from './FeeBatches';
import { PageHeader } from '../Common';
import { feeActions } from '../../redux/actions/fees.actions';
import './Fees.scss';

const TeacherFees = (props) => {
  const { clientId, clientUserId, history, setFeePlanTypeToStore } = props;
  const [carouselDetails, setCarouselDetails] = useState({});
  const [activeTab, setActiveTab] = useState('Notifications');

  useEffect(() => {
    get({ client_id: clientId }, '/getAnnualFeeDetailsForCoaching').then((res) => {
      const result = apiValidation(res);
      setCarouselDetails(result);
    });
  }, [clientId]);

  const handleSelect = (tab) => {
    setActiveTab(tab);
  };

  return (
    <>
      <PageHeader title='Fees' />
      <div style={{ marginTop: '4rem' }}>
        {activeTab !== 'Batches' && (
          <>
            <FeeCarousel carouselObject={carouselDetails} />
            <Row className=' mx-2'>
              <Button
                variant='courseBlueOnWhite'
                className='p-1 mx-2 my-auto'
                onClick={() => {
                  history.push('/fees/feeplans');
                  setFeePlanTypeToStore('onetimecharge');
                }}
                style={{ width: '160px' }}
              >
                <span style={{ fontSize: '18px' }} className='my-auto'>
                  +
                </span>
                <span className='my-auto ml-2'>One-time Charge</span>
              </Button>
              <span className='ml-auto'>
                <Button
                  variant='courseBlueOnWhite'
                  className='p-1 mx-2 my-auto'
                  onClick={() => {
                    history.push('/fees/feeplans');
                    setFeePlanTypeToStore('feePlans');
                  }}
                >
                  <span style={{ fontSize: '18px' }} className='my-auto'>
                    +
                  </span>
                  <span className='my-auto ml-2'>Fee Plan</span>
                </Button>
              </span>
            </Row>
          </>
        )}
        <Tabs
          defaultActiveKey={activeTab}
          className='Profile__Tabs mt-4'
          justify
          style={{ fontSize: '12px' }}
          activeKey={activeTab}
          onSelect={handleSelect}
        >
          <Tab
            eventKey='Notifications'
            title='Notifications'
            onClick={() => handleSelect('Notifications')}
          >
            <FeesTimeline clientId={clientId} />
          </Tab>
          <Tab eventKey='Batches' title='Batches' onClick={() => handleSelect('Batches')}>
            <FeeBatches clientId={clientId} clientUserId={clientUserId} history={history} />
          </Tab>
          <Tab eventKey='Summary' title='Summary' onClick={() => handleSelect('Summary')}>
            <div
              className='Scrollable__viewAll justify-content-center align-items-center d-flex'
              style={{ height: '50vh' }}
            >
              Coming Soon
            </div>
          </Tab>
        </Tabs>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  clientId: getClientId(state),
  clientUserId: getClientUserId(state),
});

const mapDispatchToProps = (dispatch) => {
  return {
    setFeePlanTypeToStore: (payload) => {
      dispatch(feeActions.setFeePlanTypeToStore(payload));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TeacherFees);

TeacherFees.propTypes = {
  clientId: PropTypes.number.isRequired,
  clientUserId: PropTypes.number.isRequired,
  history: PropTypes.instanceOf(Object).isRequired,
  setFeePlanTypeToStore: PropTypes.func.isRequired,
};
