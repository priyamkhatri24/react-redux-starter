import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import '../Profile/Profile.scss';
import PropTypes from 'prop-types';
import '../Live Classes/LiveClasses.scss';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import CreateIcon from '@material-ui/icons/Create';
import { get, apiValidation } from '../../Utilities';
import { getClientId } from '../../redux/reducers/clientUserId.reducer';
import './settlementPages.css';
/* eslint import/no-cycle: [2, { maxDepth: 1 }] */
import { PageHeader } from '../Common';

const SettlementPage = (props) => {
  const { clientId, history } = props;
  const [data, setData] = useState({});
  const [vendorDetails, setVendorDetails] = useState({});
  const goToEditPayment = () => {
    history.push('/teacherfees/editpayment');
  };

  useEffect(() => {
    const payload = {
      client_id: clientId,
      type: process.env.NODE_ENV === 'development' ? 'Development' : 'Production',
    };
    get(payload, '/getCashFreeAccountDetails').then((res) => {
      const result = apiValidation(res);
      console.log(result, 'getCashFreeAccountDetails');
      console.log(payload);
      setData(result);
      setVendorDetails(result.vendorDetails);
    });
  }, [clientId]);
  return (
    <>
      <div className='' style={{ marginBottom: '60px' }}>
        <PageHeader title='Settlement Account' />
      </div>
      <div className=' LiveClasses__adminCard p-2 m-3' style={{ position: 'relative' }}>
        <div
          className='Profile__edit text-center py-1'
          onClick={goToEditPayment}
          role='button'
          onKeyDown={goToEditPayment}
          tabIndex='-1'
        >
          <CreateIcon />
        </div>
        {/* {data.map((ele) => {
          return <h1>{ele.vendorDetails}</h1>;
        })} */}
        <h5 style={{ paddingBottom: '15px' }}>Info</h5>
        <h6 className='LiveClasses__adminHeading mb-0'>{vendorDetails.bank?.accountHolder}</h6>
        <p className='LiveClasses__adminDuration '>Account Holder Name</p>
        <h6 className='LiveClasses__adminHeading mb-0'>{vendorDetails.phone}</h6>
        <p className='LiveClasses__adminDuration '>Phone Number</p>
        <h6 className='LiveClasses__adminHeading mb-0'>{vendorDetails.email}</h6>
        <p className='LiveClasses__adminDuration '>Email Id</p>
        <>
          <h6 className='LiveClasses__adminHeading mb-0'>{vendorDetails.bank?.accountNumber}</h6>
          <p className='LiveClasses__adminDuration '>Account Number</p>
        </>
        <>
          <h6 className='LiveClasses__adminHeading mb-0'>{vendorDetails.bank?.ifsc}</h6>
          <p className='LiveClasses__adminDuration '>IFSC Code</p>
        </>
        <>
          <h6 className='LiveClasses__adminHeading mb-0'>{data.payment_gateway}</h6>
          <p className='LiveClasses__adminDuration '>Payment Model</p>
        </>
      </div>
    </>
  );
};
const mapStateToProps = (state) => ({
  clientId: getClientId(state),
});

SettlementPage.propTypes = {
  clientId: PropTypes.number.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default connect(mapStateToProps)(SettlementPage);
