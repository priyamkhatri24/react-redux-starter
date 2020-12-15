import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Swal from 'sweetalert2';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import Card from 'react-bootstrap/Card';
import PhoneIcon from '@material-ui/icons/Phone';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Button from 'react-bootstrap/Button';
import format from 'date-fns/format';
import fromUnixTime from 'date-fns/fromUnixTime';
import { get, apiValidation, displayRazorpay } from '../../Utilities';
import { getClientId, getClientUserId } from '../../redux/reducers/clientUserId.reducer';
import { BackButton } from '../Common';
import avatarImage from '../../assets/images/avatarImage.jpg';
import { getUserProfile } from '../../redux/reducers/userProfile.reducer';
import { getCurrentBranding } from '../../redux/reducers/branding.reducer';
import FeesCard from './FeesCard';
import './Fees.scss';

const Fees = (props) => {
  const {
    clientUserId,
    clientId,
    userProfile,
    currentbranding: {
      branding: {
        client_color: clientColor,
        client_name: clientName,
        client_logo: clientLogo,
        client_address: clientAddress,
        client_contact: clientContact,
      },
    },
    history,
  } = props;
  const [fees, setFees] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    get({ client_user_id: clientUserId }, '/getFeeDataForStudent').then((res) => {
      const result = apiValidation(res);
      console.log(result);
      setFees(result);
    });
  }, [clientUserId]);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const razorSuccess = (payload) => {
    get(payload, '/fetchOrderById').then((res) => {
      const result = apiValidation(res);
      history.push({ pathname: '/order', state: { order: result } });
      console.log(result);
    });
  };

  const startPayment = () => {
    const paymentArray = fees.fee_data.filter((elem) => {
      return elem.status === 'due' || elem.status === 'pending';
    });

    const currentPayment = paymentArray[0];

    if (currentPayment.status === 'pending') {
      Swal.fire({
        icon: 'error',
        title: 'Pending',
        text: 'You have a pending payment. Please wait while your bank processes the payment.',
      });
    } else if (currentPayment.status === 'due') {
      displayRazorpay(
        currentPayment.order_id,
        currentPayment.amount * 100,
        'INR',
        clientLogo,
        clientColor,
        clientName,
        clientAddress,
        clientContact,
        razorSuccess,
        currentPayment.user_fee_id,
        clientId,
      ).then((res) => console.log(res, 'razor'));
    }
  };

  const goToOrderDetails = (order) => {
    history.push({ pathname: '/order', state: { order } });
  };

  return (
    <div className='Fees'>
      <div className='Fees__nav'>
        <Row className=' m-0 px-4 pt-3 '>
          <div className='mt-2 mx-1 mx-lg-4'>
            <BackButton />
          </div>
          <div className='m-1 '>
            <img
              src={userProfile.profileImage ? userProfile.profileImage : avatarImage}
              alt='avatar'
              height='38'
              width='38'
              className='Fees__avatar'
            />
          </div>
          <div className='p-0'>
            <p className='Fees__avatarHeading mb-0 mt-2 ml-2'>{`${userProfile.firstName} ${userProfile.lastName}`}</p>
            <p className='Fees__avatarStatus'>
              <PhoneIcon className='Fees__onlineIcon' />
              +91-{userProfile.contact}
            </p>
          </div>
          <div className='ml-auto'>
            <MoreVertIcon />
          </div>
        </Row>
        <div>
          <Row className='mx-2 px-4 Fees__navStatus'>
            Status:
            <span className='ml-1'>{fees.fee_status}</span>
            <Button variant='customSecondary' className='ml-auto' onClick={() => handleShow()}>
              Plan Info
            </Button>
          </Row>
          <p className='Fees__navStatus mx-2 px-4'>
            <span>Due Amount: {fees.due_amount}</span>
          </p>
        </div>
        <div className='Fees__overlay'>
          {Object.keys(fees).length > 0 &&
            fees.fee_data.map((elem) => {
              return (
                <FeesCard
                  data={elem}
                  key={elem.user_fee_id}
                  clientId={clientId}
                  goToOrderDetails={goToOrderDetails}
                />
              );
            })}
        </div>
        <footer className='Fees__footer text-center'>
          {fees.due_amount > 0 ? (
            <Button variant='customPrimary' className='mt-4' onClick={() => startPayment()}>
              Pay
            </Button>
          ) : (
            <p className='text-center'>No dues to be paid</p>
          )}
        </footer>
      </div>

      <Modal show={showModal} onHide={handleClose} centered keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Plan Summary</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Card>
            <Row className='mx-0 my-3'>
              <Col className='Fees__planInfoHeading p-0 text-center' xs={3} />
              <Col className='Fees__planInfoHeading p-0 text-center' xs={3}>
                Due Date
              </Col>
              <Col className='Fees__planInfoHeading p-0 text-center' xs={3}>
                Installment
              </Col>
              <Col className='Fees__planInfoHeading p-0 text-center' xs={3} />
              {Object.keys(fees).length &&
                fees.plan_array.map((elem, i) => {
                  return (
                    <Row key={elem.user_fee_id} className='mx-0 w-100 my-2'>
                      <Col className='Fees__planInfoDetails p-0 text-center'>{i + 1}</Col>
                      <Col className='Fees__planInfoDetails p-0 text-center'>
                        {format(fromUnixTime(parseInt(elem.due_date, 10)), 'dd-MMM-yyyy')}
                      </Col>
                      <Col className='Fees__planInfoDetails p-0 text-center'>
                        &#x20b9; {elem.amount}
                      </Col>
                      <Col
                        className='Fees__planInfoDetails p-0 text-center'
                        style={
                          elem.status === 'due'
                            ? { color: ' rgba(255, 0, 0, 0.87)' }
                            : { color: ' rgba(58, 255, 0, 0.87)' }
                        }
                      >
                        {elem.status.toUpperCase()}
                      </Col>
                    </Row>
                  );
                })}
            </Row>
            <Row className='justify-content-end p-3 mx-0' style={{ background: '#F3F3F3' }}>
              <span className='Fees__planInfoTotal mr-2'>Total</span>
              <span className='Fees__planInfoTotalFees'>&#x20b9; {fees.due_amount}</span>
            </Row>

            <p className='Fees__planInfoHeading mt-4 ml-4'>Add-on:</p>
            <Row className='mx-0 my-2'>
              {Object.keys(fees).length &&
                fees.one_time_plan_array.map((elem, i) => {
                  return (
                    <Row key={elem.user_fee_id} className='mx-0 w-100 my-2'>
                      <Col className='Fees__planInfoDetails p-0 text-center'>{i + 1}</Col>
                      <Col className='Fees__planInfoDetails p-0 text-center'>{elem.fee_tag}</Col>
                      <Col className='Fees__planInfoDetails p-0 text-center'>
                        &#x20b9; {elem.amount}
                      </Col>
                      <Col
                        className='Fees__planInfoDetails p-0 text-center'
                        style={
                          elem.status === 'due'
                            ? { color: ' rgba(255, 0, 0, 0.87)' }
                            : { color: ' rgba(58, 255, 0, 0.87)' }
                        }
                      >
                        {elem.status.toUpperCase()}
                      </Col>
                    </Row>
                  );
                })}
            </Row>
          </Card>
        </Modal.Body>
      </Modal>
    </div>
  );
};

const mapStateToProps = (state) => ({
  clientUserId: getClientUserId(state),
  clientId: getClientId(state),
  userProfile: getUserProfile(state),
  currentbranding: getCurrentBranding(state),
});

export default connect(mapStateToProps)(Fees);
