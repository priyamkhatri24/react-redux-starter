import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';
import { connect } from 'react-redux';
import fromUnixTime from 'date-fns/fromUnixTime';
import Row from 'react-bootstrap/Row';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import isBefore from 'date-fns/isBefore';
import { getClientId, getClientUserId } from '../../redux/reducers/clientUserId.reducer';
import { BatchesSelector, FeeScrollableCards, PageHeader, StudentSelector } from '../Common';
import { apiValidation, get, post } from '../../Utilities';
import { getCurrentBranding } from '../../redux/reducers/branding.reducer';
import { getfeePlanType } from '../../redux/reducers/fees.reducer';
import '../Common/ScrollableCards/ScrollableCards.scss';
import './Fees.scss';
import MonthlyCustomPlan from './MonthlyCustomPlan';
import OneTimeCharge from './OneTimeCharge';

const FeePlans = (props) => {
  const {
    history,
    clientId,
    clientUserId,
    feePlanType,
    currentbranding: {
      branding: { currency_code: currencyCode, currency_symbol: currencySymbol },
    },
  } = props;
  const [recentPlans, setRecentPlans] = useState([]);
  const [batchSearchString, setBatchSearchString] = useState('');
  const [studentSearchString, setStudentSearchString] = useState('');

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
    get({ client_id: clientId }, '/getAllBatchesOfCoaching').then((res) => {
      console.log(res);
      const result = apiValidation(res);
      setBatches(result);
    });
    get(null, '/getFeeTags').then((res) => {
      console.log(res);
      const result = apiValidation(res);
      setFeeTags(result);
    });
  }, [clientUserId, feePlanType, clientId]);

  const getPlanValue = (name, amount) => {
    setTagName(name);
    setTagAmount(amount);
  };

  const getSelectedBatches = (allbatches, selectBatches) => {
    setBatches(allbatches);
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

  const getSelectedStudents = (allstudents, selectStudents) => {
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
    const customPlanForPost = customFeePlanArray.map((elem) => {
      elem.due_date = (elem.date.getTime() / 1000).toFixed(0);
      return elem;
    });

    const payload = {
      client_user_id: clientUserId,
      user_array: JSON.stringify(selectedStudents),
      admin_id: clientUserId,
      is_replace: feePlanType === 'onetimecharge' ? replaceOptions === 'replace' : true,
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
          : customPlanForPost,
      ),
      plan_type:
        feePlanType === 'onetimecharge'
          ? 'oneTime'
          : monthlyOrCustom === 'Monthly'
          ? 'monthly'
          : 'custom',
    };

    console.log(customPlanForPost, 'aCustomPlanForPost');
    post(payload, '/addFeeToMultipleUsers').then((responce) => {
      console.log(responce);
      if (responce.success) {
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
      console.log(customFeePlanArray, 'ji');
      const addToFeePlan = elem.plan_array.map((e) => {
        const obj = {};
        obj.id = Math.floor(Math.random() * 100000).toString(16);
        obj.isRead = true;
        obj.date = fromUnixTime(parseInt(e.due_date, 10));
        obj.amount = parseInt(e.amount, 10);
        obj.due_date = parseInt(e.due_date, 10);
        return obj;
      });
      console.log('hamara,', addToFeePlan);
      setCustomFeePlanArray(addToFeePlan);
      setNoOfInstallments(elem.plan_array.length);
    }
  };

  const searchBatches = (search) => {
    setBatchSearchString(search);
  };

  const filterBatches = (e) => {
    if (e.batch_name.toLowerCase().indexOf(batchSearchString.toLowerCase()) > -1) {
      e.dontShow = false;
    } else e.dontShow = true;
    return e;
  };

  const searchStudents = (search) => {
    setStudentSearchString(search);
  };

  const filterStudents = (e) => {
    if (
      e.first_name.toLowerCase().indexOf(studentSearchString.toLowerCase()) > -1 ||
      e.last_name.toLowerCase().indexOf(studentSearchString.toLowerCase()) > -1
    ) {
      e.dontShow = false;
    } else e.dontShow = true;
    return e;
  };

  useEffect(() => {
    console.log(customFeePlanArray, 'xxxCustomFEE');
  }, [customFeePlanArray]);

  return (
    <>
      <PageHeader title={feePlanType === 'onetimecharge' ? 'One Time Charge' : 'Fee Plans'} />
      <div
        className='Fees__plansContainer'
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
          currencySymbol={currencySymbol}
          planType={feePlanType}
          getPlanValue={feePlanType === 'onetimecharge' ? getPlanValue : getMonthlyOrCustom}
        />
        {feePlanType === 'onetimecharge' && (
          <OneTimeCharge
            tagAmount={tagAmount}
            currencySymbol={currencySymbol}
            tagName={tagName}
            tags={feeTags}
            setTagAmount={setTagAmount}
            setTagName={setTagName}
          />
        )}

        {feePlanType === 'feePlans' && (
          <MonthlyCustomPlan
            monthlyFeeAmount={monthlyFeeAmount}
            currencySymbol={currencySymbol}
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
          <Button variant='customPrimary' onClick={() => handleBatchesOpen()}>
            Next
          </Button>
        </Row>
        <Modal show={showBatchesModal} onHide={handleBatchesClose} centered>
          <Modal.Header closeButton>
            <PageHeader
              notFixed
              noBack
              search
              searchFilter={searchBatches}
              title='Select Batches'
            />
          </Modal.Header>
          <BatchesSelector
            search
            batches={batches.map(filterBatches)}
            selectBatches={selectedBatches}
            getSelectedBatches={getSelectedBatches}
            title='Batches'
            sendBoth
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
              <PageHeader
                notFixed
                noBack
                search
                searchFilter={searchStudents}
                title='Select Students'
              />
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
            students={students.map(filterStudents)}
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
  currentbranding: getCurrentBranding(state),
  feePlanType: getfeePlanType(state),
});

export default connect(mapStateToProps)(FeePlans);

FeePlans.propTypes = {
  clientId: PropTypes.number.isRequired,
  clientUserId: PropTypes.number.isRequired,
  history: PropTypes.instanceOf(Object).isRequired,
  feePlanType: PropTypes.string.isRequired,
  currentbranding: PropTypes.shape({
    branding: PropTypes.shape({
      currency_code: PropTypes.string,
      currency_symbol: PropTypes.string,
    }),
  }).isRequired,
};
