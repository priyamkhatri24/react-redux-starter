import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';
import { connect } from 'react-redux';
import Card from 'react-bootstrap/Card';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import fromUnixTime from 'date-fns/fromUnixTime';
import Row from 'react-bootstrap/Row';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import isBefore from 'date-fns/isBefore';
import { getClientId, getClientUserId } from '../../redux/reducers/clientUserId.reducer';
import { BatchesSelector, FeeScrollableCards, PageHeader, StudentSelector } from '../Common';
import { apiValidation, get, post } from '../../Utilities';
import { getfeePlanType } from '../../redux/reducers/fees.reducer';
import '../Common/ScrollableCards/ScrollableCards.scss';
import './Fees.scss';
import MonthlyCustomPlan from './MonthlyCustomPlan';

const OneTimeCharge = (props) => {
  const { tags, setTagAmount, setTagName, tagAmount, tagName } = props;
  const [showModal, setShowModal] = useState(false);
  const [showOtherTagName, setOtherTagName] = useState(false);
  const handleClose = () => setShowModal(false);

  return (
    <Card
      style={{ boxShadow: '0px 1px 3px 0px rgba(0,0,0,0.16)', borderRadius: '10px' }}
      className='m-2 p-2'
    >
      <p className='Scrollable__recentlyUsed m-2'>One Time charge name</p>

      <Row className='m-2'>
        <label htmlFor='Enter Type' className='w-100 has-float-label my-auto'>
          <input
            className='form-control'
            name='Enter Type'
            type='text'
            placeholder='Enter Type (eg: Registration fee)'
            onClick={() => setShowModal(true)}
            readOnly
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
          onChange={(e) => setTagAmount(e.target.value)}
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
                    onClick={() => {
                      setTagName(e.tag_name);
                      handleClose();
                    }}
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
                onChange={(e) => setTagName(e.target.value)}
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

const FeePlans = (props) => {
  const { history, clientId, clientUserId, feePlanType } = props;
  const [recentPlans, setRecentPlans] = useState([]);
  const [feeTags, setFeeTags] = useState([]);
  const [tagName, setTagName] = useState('');
  const [tagAmount, setTagAmount] = useState('');
  const [batches, setBatches] = useState([]);
  const [selectedBatches, setSelectedBatches] = useState([]);
  const [showBatchesModal, setShowBatchesModal] = useState(false);
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [showStudentsModal, setShowStudentsModal] = useState(false);
  const [existingStudentsNumber, setExistingStudentsNumber] = useState(0);
  const [showAssignPlanModal, setShowAssignPlanModal] = useState(false);
  const [replaceOptions, setOptions] = useState('');
  const [monthlyFeeAmount, setMonthlyFeeAmount] = useState('');
  const [monthlyFeeDate, setMonthlyFeeDate] = useState(new Date());
  const [noOfInstallments, setNoOfInstallments] = useState(1);
  const [customFeePlanArray, setCustomFeePlanArray] = useState([
    {
      id: 0,
      amount: 0,
      due_date: parseInt((new Date().getTime() / 1000).toFixed(0), 10),
      date: new Date(),
      isRead: true,
    },
  ]);
  const [monthlyOrCustom, setMonthlyOrCustom] = useState('Monthly');

  useEffect(() => {
    const url =
      feePlanType === 'onetimecharge' ? '/getRecentOneTimePlansOfUser' : '/getRecentPlansOfUser';
    get({ client_user_id: clientUserId }, url).then((res) => {
      const result = apiValidation(res);
      setRecentPlans(result);
    });

    get(null, '/getFeeTags').then((res) => {
      console.log(res);
      const result = apiValidation(res);
      setFeeTags(result);
    });
  }, [clientUserId, feePlanType]);

  const getPlanValue = (name, amount) => {
    setTagName(name);
    setTagAmount(amount);
  };

  const getBatchesOfCoaching = () => {
    get({ client_id: clientId }, '/getAllBatchesOfCoaching').then((res) => {
      console.log(res);
      const result = apiValidation(res);
      setBatches(result);
      handleBatchesOpen();
    });
  };

  const getSelectedBatches = (selectBatches) => {
    setSelectedBatches(selectBatches);
  };

  const handleBatchesClose = () => setShowBatchesModal(false);
  const handleBatchesOpen = () => setShowBatchesModal(true);

  const getStudentsOfBatches = () => {
    const idBatches = selectedBatches.map((e) => e.client_batch_id);

    const payload = {
      batch_array: JSON.stringify(idBatches),
      plan_type:
        feePlanType === 'onetimecharge'
          ? 'oneTime'
          : monthlyOrCustom === 'Monthly'
          ? 'monthly'
          : 'custom',
      fee_tag: tagName,
    };
    get(payload, '/getStudentsOfBatchArrayForFee').then((res) => {
      console.log(res);
      const result = apiValidation(res);
      setStudents(result);
      handleBatchesClose();
      handleStudentsOpen();
    });
  };

  const handleStudentsClose = () => setShowStudentsModal(false);
  const handleStudentsOpen = () => setShowStudentsModal(true);

  const getSelectedStudents = (selectStudents) => {
    setSelectedStudents(selectStudents);
    console.log(selectStudents);
  };

  const handleAssignPlanClose = () => setShowAssignPlanModal(false);
  const handleAssignPlanOpen = () => setShowAssignPlanModal(true);

  const checkForExistingPlans = () => {
    const existingStudents = selectedStudents.filter((e) => e.is_fee === 'true');
    setExistingStudentsNumber(existingStudents.length);
    handleStudentsClose();
    handleAssignPlanOpen();
  };

  const assignFeesToStudents = () => {
    const payload = {
      client_user_id: clientUserId,
      is_replace: feePlanType === 'onetimecharge' ? replaceOptions === 'replace' : true,
      user_array: JSON.stringify(selectedStudents),
      plan_type:
        feePlanType === 'onetimecharge'
          ? 'oneTime'
          : monthlyOrCustom === 'Monthly'
          ? 'monthly'
          : 'custom',
      plan_array: JSON.stringify(
        feePlanType === 'onetimecharge'
          ? [{ amount: tagAmount, name: tagName }]
          : monthlyOrCustom === 'Monthly'
          ? [
              {
                amount: monthlyFeeAmount,
                due_date: parseInt((monthlyFeeDate.getTime() / 1000).toFixed(0), 10),
              },
            ]
          : customFeePlanArray,
      ),
    };

    post(payload, '/addFeeToMultipleUsers').then((res) => {
      console.log(res);
      if (res.success) {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: `Users have been added.`,
        });
        history.push('/teacherfees');
      }
    });
  };

  const getMonthlyOrCustom = (elem) => {
    if (elem.plan_type === 'monthly') {
      const currDate = fromUnixTime(parseInt(elem.plan_array[0].due_date, 10));
      setMonthlyFeeDate(isBefore(currDate, new Date()) ? new Date() : currDate);
      setMonthlyFeeAmount(elem.plan_array[0].amount);
      setMonthlyOrCustom('Monthly');
    } else {
      setMonthlyOrCustom('Custom');
      console.log(elem);
      console.log(customFeePlanArray);
      const addToFeePlan = elem.plan_array.map((e) => {
        e.date = fromUnixTime(parseInt(e.due_date, 10));
        e.isRead = true;
        e.amount = parseInt(e.amount, 10);
        return e;
      });
      console.log('hamara,', addToFeePlan);
      setCustomFeePlanArray(addToFeePlan);
      //  setNoOfInstallments(elem.plan_array.length + 1); // doing this to trigger a re render. I am stupid that way.
      setNoOfInstallments(elem.plan_array.length);
    }
  };

  return (
    <>
      <PageHeader title={feePlanType === 'onetimecharge' ? 'One Time Charge' : 'Fee Plans'} />
      <div
        style={{
          marginTop: '4rem',
          height: '100vh',
          overflowY: 'scroll',
          maxWidth: '100%',
          overflowX: 'hidden',
        }}
      >
        <FeeScrollableCards
          data={recentPlans}
          planType={feePlanType}
          getPlanValue={feePlanType === 'onetimecharge' ? getPlanValue : getMonthlyOrCustom}
        />
        {feePlanType === 'onetimecharge' && (
          <OneTimeCharge
            tagAmount={tagAmount}
            tagName={tagName}
            tags={feeTags}
            setTagAmount={setTagAmount}
            setTagName={setTagName}
          />
        )}

        {feePlanType === 'feePlans' && (
          <MonthlyCustomPlan
            monthlyFeeAmount={monthlyFeeAmount}
            setMonthlyFeeAmount={setMonthlyFeeAmount}
            monthlyFeeDate={monthlyFeeDate}
            setMonthlyFeeDate={setMonthlyFeeDate}
            noOfInstallments={noOfInstallments}
            setNoOfInstallments={setNoOfInstallments}
            customFeePlanArray={customFeePlanArray}
            setCustomFeePlanArray={setCustomFeePlanArray}
            activeTab={monthlyOrCustom}
            changeTab={setMonthlyOrCustom}
          />
        )}
        <Row className='justify-content-center my-3'>
          <Button variant='customPrimary' onClick={() => getBatchesOfCoaching()}>
            Next
          </Button>
        </Row>
        <Modal show={showBatchesModal} onHide={handleBatchesClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>Select Batches</Modal.Title>
          </Modal.Header>
          <BatchesSelector
            batches={batches}
            selectBatches={selectedBatches}
            getSelectedBatches={getSelectedBatches}
            title='Batches'
          />
          <Modal.Footer>
            <Button variant='customPrimary' onClick={() => getStudentsOfBatches()}>
              Next
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={showStudentsModal} onHide={handleStudentsClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>
              Select Students{' '}
              <p
                style={{
                  fontSize: '10px',
                  lineHeight: '13px',
                  color: 'rgba(0, 0, 0, 0.54)',
                  fontFamily: 'Montserrat-Medium',
                }}
              >
                Selected Students Shown in light color already have existing fee plan
              </p>
            </Modal.Title>
          </Modal.Header>
          <StudentSelector
            students={students}
            selectedStudents={selectedStudents}
            getSelectedStudents={getSelectedStudents}
            title='Students'
          />
          <Modal.Footer>
            <Button variant='customPrimary' onClick={() => checkForExistingPlans()}>
              Next
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={showAssignPlanModal} onHide={handleAssignPlanClose} centered>
          <Modal.Body>
            {existingStudentsNumber === 0 && feePlanType === 'onetimecharge' ? (
              <p className='Scrollable__recentlyUsed m-2'>
                {`One-time charge "${tagName}"
            will be assigned to selected students. Are you sure?`}
              </p>
            ) : (
              existingStudentsNumber === 0 && (
                <p className='Scrollable__recentlyUsed m-2'>
                  Created fee plan will be assigned to selected students. Are you sure?
                </p>
              )
            )}

            {existingStudentsNumber > 0 && (
              <>
                {feePlanType === 'onetimecharge' ? (
                  <>
                    <p className='Scrollable__recentlyUsed m-2'>
                      {`${existingStudentsNumber} of the selected students have existing One-time charge with name
                  "${tagName}". Please choose one of the options for them`}
                    </p>
                    <Form className='Enquiry__form mt-3 mx-2 '>
                      <div className='mb-3'>
                        <Form.Check
                          type='radio'
                          id='feePlanReplace'
                          label='Replace with this one time charge'
                          value='replace'
                          name='feePlan'
                          onChange={(e) => setOptions(e.target.value)}
                        />

                        <Form.Check
                          type='radio'
                          label='Add this one time charge also'
                          id='feePlanNoReplace'
                          value='noReplace'
                          name='feePlan'
                          onChange={(e) => setOptions(e.target.value)}
                        />
                      </div>
                    </Form>
                  </>
                ) : (
                  <>
                    <p className='Scrollable__recentlyUsed m-2'>
                      {`${existingStudentsNumber} of the selected students have existing Fee Plans.
                     Their existing fee plan will be replaced with this plan. Are you sure?`}
                    </p>
                  </>
                )}
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant='boldTextSecondary' onClick={() => handleAssignPlanClose()}>
              Cancel
            </Button>
            <Button variant='boldText' onClick={() => assignFeesToStudents()}>
              Assign
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  clientId: getClientId(state),
  clientUserId: getClientUserId(state),
  feePlanType: getfeePlanType(state),
});

export default connect(mapStateToProps)(FeePlans);

FeePlans.propTypes = {
  clientId: PropTypes.number.isRequired,
  clientUserId: PropTypes.number.isRequired,
  history: PropTypes.instanceOf(Object).isRequired,
  feePlanType: PropTypes.string.isRequired,
};

OneTimeCharge.propTypes = {
  tags: PropTypes.instanceOf(Array).isRequired,
  setTagAmount: PropTypes.func.isRequired,
  setTagName: PropTypes.func.isRequired,
  tagName: PropTypes.string.isRequired,
  tagAmount: PropTypes.string.isRequired,
};
