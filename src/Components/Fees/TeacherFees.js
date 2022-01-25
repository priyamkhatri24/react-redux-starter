import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import { connect } from 'react-redux';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import { getClientId, getClientUserId } from '../../redux/reducers/clientUserId.reducer';
import { apiValidation, get } from '../../Utilities';
import FeeCarousel from './FeeCarousel';
import FeesTimeline from './FeesTimeline';
import FeeBatches from './FeeBatches';
import BottomNavigation from '../Common/BottomNavigation/BottomNavigation';
import AllStudentsForFee from './AllStudentsForFee';
import FeeUserDetails from './FeeUserDetails';
import { PageHeader } from '../Common';
import { getCurrentBranding } from '../../redux/reducers/branding.reducer';
import { feeActions } from '../../redux/actions/fees.actions';
import './Fees.scss';

const TeacherFees = (props) => {
  const {
    clientId,
    clientUserId,
    history,
    setFeePlanTypeToStore,
    currentbranding: {
      branding: { currency_code: currencyCode, currency_symbol: currencySymbol },
    },
  } = props;
  const [carouselDetails, setCarouselDetails] = useState({});
  const [activeTab, setActiveTab] = useState('Notifications');
  const [searchString, setSearchString] = useState('');

  useEffect(() => {
    get({ client_id: clientId }, '/getAnnualFeeDetailsForCoaching').then((res) => {
      const result = apiValidation(res);
      setCarouselDetails(result);
    });
  }, [clientId]);

  const handleSelect = (tab) => {
    setActiveTab(tab);
    window.scrollTo(0, 0);
  };

  const searchBatches = (search) => {
    setSearchString(search);
  };

  return (
    <>
      {/* {activeTab === 'Batches' || activeTab === 'Notifications' || activeTab === 'Students' ? (
        <PageHeader title='Fees' search searchFilter={searchBatches} />
      ) : (
        <PageHeader title='Fees' />
      )} */}

      <div style={{ marginTop: '4rem' }}>
        {activeTab === 'Notifications' && (
          <>
            <FeeCarousel currencySymbol={currencySymbol} carouselObject={carouselDetails} />
            <Row className=' mx-2 Fees__TwobuttonsRow'>
              <Button
                variant='courseBlueOnWhite'
                className='p-1 mx-1 my-auto Fees__twoButtons'
                onClick={() => {
                  history.push('/fees/feeplans');
                  setFeePlanTypeToStore('onetimecharge');
                }}
              >
                <span className='my-auto Fees__twoButtonstext'>+</span>
                <span className='my-auto ml-2 Fees__twoButtonstext'>One-time Charge</span>
              </Button>
              <span className=''>
                <Button
                  variant='courseBlueOnWhite'
                  className='p-1 mx-1 my-auto Fees__twoButtons'
                  onClick={() => {
                    history.push('/fees/feeplans');
                    setFeePlanTypeToStore('feePlans');
                  }}
                >
                  <span className='my-auto Fees__twoButtonstext'>+</span>
                  <span className='my-auto ml-2 Fees__twoButtonstext'>Fee Plan</span>
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
            style={{ marginBottom: '0.5rem' }}
            onClick={() => handleSelect('Notifications')}
          >
            <FeesTimeline
              currencySymbol={currencySymbol}
              clientId={clientId}
              activeTab={activeTab === 'Notifications'}
            />
          </Tab>
          <Tab
            style={{ marginBottom: '0.5rem' }}
            eventKey='Batches'
            title='Batches'
            onClick={() => handleSelect('Batches')}
          >
            <FeeBatches
              clientId={clientId}
              currencySymbol={currencySymbol}
              clientUserId={clientUserId}
              activeTab={activeTab === 'Batches'}
              history={history}
              searchString={searchString}
            />
          </Tab>
          <Tab
            style={{ marginBottom: '0.5rem' }}
            eventKey='Students'
            title='Students'
            onClick={() => handleSelect('Students')}
          >
            <AllStudentsForFee
              clientUserId={clientUserId}
              currencySymbol={currencySymbol}
              activeTab={activeTab === 'Students'}
              clientId={clientId}
              history={history}
              searchString={searchString}
            />
            {/* <FeeUserDetails clientId={clientId} history={history} searchString={searchString} /> */}
          </Tab>
        </Tabs>
      </div>
      <BottomNavigation activeNav='fees' history={history} />
    </>
  );
};

const mapStateToProps = (state) => ({
  clientId: getClientId(state),
  clientUserId: getClientUserId(state),
  currentbranding: getCurrentBranding(state),
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
  currentbranding: PropTypes.shape({
    branding: PropTypes.shape({
      currency_code: PropTypes.string,
      currency_symbol: PropTypes.string,
    }),
  }).isRequired,
};
