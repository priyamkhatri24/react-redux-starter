import React, { useState } from 'react';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Form from 'react-bootstrap/Form';
import { connect } from 'react-redux';
import Swal from 'sweetalert2';
import PropTypes from 'prop-types';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
// eslint-disable-next-line
import '../OfflineAssignments/AssignmentForm';
import { getClientId } from '../../redux/reducers/clientUserId.reducer';
import { apiValidation, post } from '../../Utilities';
// eslint-disable-next-line
import { PageHeader } from '../Common';
import './Fees.scss';

const EditPayment = (props) => {
  const { clientId, history } = props;
  console.log(history.location.state);
  const [holderName, setholderName] = useState(history.location.state.vendorDetails.name);
  const [phoneNum, setPhoneNum] = useState(history.location.state.vendorDetails.phone);
  const [emailID, setEmailID] = useState(history.location.state.vendorDetails.email);
  const [accountNo, SetAccountNo] = useState(
    history.location.state.vendorDetails.bank.accountNumber,
  );
  const [ifsc, SetIfsc] = useState(history.location.state.vendorDetails.bank.ifsc);
  const [radioBtn, setRadioBtn] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      account_holder_name: holderName,
      phone: phoneNum,
      email: emailID,
      account_number: accountNo,
      ifsc_code: ifsc,
      type: process.env.NODE_ENV === 'development' ? 'Development' : 'Production',
      client_id: clientId,
      account_type: radioBtn,
    };
    post(data, '/editCashFreeAccountDetails').then((res) => {
      console.log(res);
      if (res.success === 1) {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: `Vendor payment details have been updated successfully`,
        }).then((resp) => {
          if (resp.isConfirmed) history.push('/teacherfees');
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops!',
          text: `Unable to update vendor details`,
        }).then((resp) => {
          if (resp.isConfirmed) history.push('/teacherfees');
        });
      }
      console.log(data);
    });
  };
  return (
    <div className='mainFormPage'>
      <div className='marginBottomHeader upperMargin'>
        <PageHeader transparentBlue title='Vendor Details' customIcon={<MoreVertIcon />} />
      </div>
      <div className='OFAFormContainer' style={{ marginTop: '30px' }}>
        <div className='OFAForm__formContainerOffline'>
          <Row>
            <form className='OFAForm__form'>
              <label className='has-float-label my-3'>
                <input
                  className='form-control'
                  name='holdername'
                  type='text'
                  placeholder=''
                  value={holderName}
                  onChange={(event) => setholderName(event.target.value)}
                />
                <span>Account Holder Name</span>
                {!holderName && <p className='validationErrorOFAForm'>*This field is required</p>}
              </label>
              <label className='has-float-label my-3'>
                <input
                  className='form-control'
                  name='phoneNum'
                  type='text'
                  placeholder=''
                  value={phoneNum}
                  onChange={(event) => setPhoneNum(event.target.value)}
                />
                <span>Phone</span>
                {!phoneNum && <p className='validationErrorOFAForm'>*This field is required</p>}
              </label>
              <label className='has-float-label my-3'>
                <input
                  className='form-control'
                  name='email'
                  type='text'
                  placeholder=''
                  value={emailID}
                  onChange={(event) => setEmailID(event.target.value)}
                />
                <span>Email</span>
                {!emailID && <p className='validationErrorOFAForm'>*This field is required</p>}
              </label>
              <label className='has-float-label my-3'>
                <input
                  className='form-control'
                  name='accountNo'
                  type='text'
                  placeholder=''
                  value={accountNo}
                  onChange={(event) => SetAccountNo(event.target.value)}
                />
                <span>Account Number</span>
                {!accountNo && <p className='validationErrorOFAForm'>*This field is required</p>}
              </label>
              <label className='has-float-label my-3'>
                <input
                  className='form-control'
                  name='ifsc'
                  type='text'
                  placeholder=''
                  value={ifsc}
                  onChange={(event) => SetIfsc(event.target.value)}
                />
                <span>IFSC Code</span>
                {!ifsc && <p className='validationErrorOFAForm'>*This field is required</p>}
              </label>
              <h6>Select your payment model:</h6>
              <Col xs='auto'>
                <Form.Check
                  type='radio'
                  value={radioBtn}
                  onChange={(event) => setRadioBtn('cashfree')}
                  name='select'
                  id='autoSizingCheck'
                  className='mb-2'
                  // eslint-disable-next-line
                  label='Your student will bear 
            the Cashfree payment getway charges.(eg. For order amout of $ 100 + $ 0.18 = $ 100.18 
            and you will get $ 100)'
                />
              </Col>
              <Col xs='auto'>
                <Form.Check
                  type='radio'
                  value={radioBtn}
                  name='select'
                  onChange={(event) => setRadioBtn('cashfreeone')}
                  id='autoSizingCheck'
                  className='mb-2'
                  // defaultChecked=''
                  // eslint-disable-next-line
                  label='Institute will bear the
             Cashfree payment getway charges.(eg. For order amout of $ 100 - $ 0.18 = $ 99.82 and you will get $ 99.82)'
                />
              </Col>
            </form>
          </Row>
        </div>
      </div>
      <Button
        className='buttonSubmit'
        variant='primary'
        type='submit'
        onClick={(e) => handleSubmit(e)}
      >
        Submit
      </Button>
    </div>
  );
};

const mapStateToProps = (state) => ({
  clientId: getClientId(state),
});

EditPayment.propTypes = {
  clientId: PropTypes.number.isRequired,
  history: PropTypes.instanceOf(Object).isRequired,
};

export default connect(mapStateToProps)(EditPayment);
