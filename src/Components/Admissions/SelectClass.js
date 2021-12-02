import React from 'react';
// import RangeSlider from 'react-bootstrap-range-slider';
import Swal from 'sweetalert2';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// import Row from 'react-bootstrap/Row';
// import Button from 'react-bootstrap/Button';
// import Modal from 'react-bootstrap/Modal';
import { PageHeader } from '../Common';
// import class123 from '../../assets/images/admissions/class123.svg';
// import class45 from '../../assets/images/admissions/class45.svg';
// import class67 from '../../assets/images/admissions/class67.svg';
// import class89 from '../../assets/images/admissions/class89.svg';
// import class10th from '../../assets/images/admissions/class10th.svg';
// import class11th from '../../assets/images/admissions/class11th.svg';
// import class12th from '../../assets/images/admissions/class12th.svg';
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';
import { post } from '../../Utilities';
// import { admissionActions } from '../../redux/actions/admissions.action';
import {
  getAdmissionBatchDate,
  getAdmissionBatchDescription,
  getAdmissionBatchName,
} from '../../redux/reducers/admissions.reducer';
import { getClientId, getClientUserId } from '../../redux/reducers/clientUserId.reducer';

const SelectClass = (props) => {
  const {
    // setAdmissionSubjectArrayToStore,
    // admissionUserArray,
    clientId,
    clientUserId,
    admissionBatchDate,
    admissionBatchDescription,
    admissionBatchName,
    // setAdmissionClassIdToStore,
    history,
  } = props;
  // const [classNo, setClassNo] = useState('6');
  // const [classArray, setClassArray] = useState([]);
  // const [currentSubjectArray, setCurrentSubjectArray] = useState([]);
  // const [subjectIdArray, setSubjectIdArray] = useState([]);
  // const [classId, setClassId] = useState(0);
  /** ****************************Batches Modal Logic***************************** */

  // const [showModal, setShowModal] = useState(false);
  // const [batches, setBatches] = useState([]);
  // const [selectedBatches, setSelectedBatches] = useState([]);
  // const handleClose = () => setShowModal(false);
  // const handleOpen = () => setShowModal(true);
  // const getSelectedBatches = (selectBatches) => {
  //   setSelectedBatches(selectBatches);
  // };

  // useEffect(() => {
  //   get({ client_id: clientId }, '/getAllBatchesOfCoaching').then((res) => {
  //     console.log(res);
  //     const result = apiValidation(res);
  //     setBatches(result);
  //   });
  // }, [clientId]);

  // const addUserToWhiteList = () => {
  //   const payload = {
  //     plan_array: null,
  //     plan_type: null,
  //     client_id: clientId,
  //     user_array: JSON.stringify(admissionUserArray),
  //     // class_id: classId,
  //     // subject_array: JSON.stringify(subjectIdArray),
  //     role_array: JSON.stringify([1]),
  //     batch_array: JSON.stringify(selectedBatches.map((e) => e.client_batch_id)),
  //   };

  //   Swal.fire({
  //     title: 'Add Users',
  //     text: 'Do you wish to add the User(s)?',
  //     icon: 'question',
  //     confirmButtonText: `Yes`,
  //     showDenyButton: true,
  //     customClass: 'Assignments__SweetAlert',
  //   }).then((resp) => {
  //     if (resp.isConfirmed) {
  //       post(payload, '/addMultipleUsersInWhiteList').then((res) => {
  //         if (res.success) {
  //           history.push('/admissions');
  //         }
  //       });
  //     }
  //   });
  // };
  /** ********************************************************************* */

  // useEffect(() => {
  //   get(null, '/getAllClassesWithSubjects').then((res) => {
  //     console.log(res);
  //     const result = apiValidation(res);
  //     setClassArray(result);
  //   });
  // }, []);

  // useEffect(() => {
  //   setSubjectIdArray([]);
  //   const subjectArray =
  //     classArray.length > 0
  //       ? classArray
  //           .filter((e) => e.class_name === classNo)[0]
  //           .subject_array.map((e) => {
  //             const newObj = { ...e, isSelected: false };
  //             return newObj;
  //           })
  //       : [];
  //   const currentClassId =
  //     classArray.length > 0 ? classArray.filter((e) => e.class_name === classNo)[0].class_id : 0;

  //   setClassId(currentClassId);
  //   setCurrentSubjectArray(subjectArray);
  // }, [classNo, classArray]);

  // const selectSubject = (id) => {
  //   const newSubjectAraay = currentSubjectArray.map((elem) => {
  //     if (elem.class_subject_id === id && elem.isSelected === true) {
  //       const newSubjectIdArray = subjectIdArray.filter((e) => e.class_subject_id !== id);
  //       setSubjectIdArray(newSubjectIdArray);
  //       elem.isSelected = false;
  //     } else if (elem.class_subject_id === id && elem.isSelected === false) {
  //       const newSubjectIdArray = [...subjectIdArray, elem];
  //       setSubjectIdArray(newSubjectIdArray);
  //       elem.isSelected = true;
  //     }
  //     return elem;
  //   });

  //   setCurrentSubjectArray(newSubjectAraay);
  // };

  const goToNextStage = () => {
    if (history.location.state && history.location.state.isBatch) {
      const payload = {
        batch_name: admissionBatchName,
        description: admissionBatchDescription,
        client_id: clientId,
        client_user_id: clientUserId,
        // class_array: JSON.stringify([classId]),
        // subject_array: JSON.stringify(subjectIdArray.map((e) => e.subject_id)),
        // subject_array: JSON.stringify([1]),

        session_end_date: admissionBatchDate.getTime(),
        // class_subject_id: subjectIdArray[0].class_subject_id,
      };
      Swal.fire({
        title: 'Add Batch',
        text: 'Do you wish to create a Batch?',
        icon: 'question',
        confirmButtonText: `Yes`,
        showDenyButton: true,
        customClass: 'Assignments__SweetAlert',
      }).then((resp) => {
        if (resp.isConfirmed) {
          post(payload, '/addBatch').then((res) => {
            if (res.success) {
              history.push('/admissions');
            }
          });
        }
      });
    }
  };

  return (
    <>
      <PageHeader title='Add Batch' />
      {goToNextStage()}
      {/* <div style={{ marginTop: '4rem', textAlign: 'center' }}>
        <img
          src={
            classNo === '1' || classNo === '2' || classNo === '3'
              ? class123
              : classNo === '4' || classNo === '5'
              ? class45
              : classNo === '6' || classNo === '7'
              ? class67
              : classNo === '8' || classNo === '9'
              ? class89
              : classNo === '10'
              ? class10th
              : classNo === '11'
              ? class11th
              : class12th
          }
          alt='bacha'
          className='img-fluid'
        />
        <div className='m-2 p-4'>
          <RangeSlider
            max={12}
            min={1}
            value={classNo}
            onChange={(e) => setClassNo(e.target.value)}
            tooltip='on'
          />
        </div>
        <Row className='justify-content-center m-2'>
          {currentSubjectArray.map((e) => {
            return (
              <Button
                key={e.class_subject_id}
                variant={e.isSelected ? 'customPrimary' : 'noticeBoardPost'}
                className='m-2'
                onClick={() => selectSubject(e.class_subject_id)}
              >
                {e.subject_name}
              </Button>
            );
          })}
        </Row>
        <Row className='justify-content-center m-4'>
          <Button variant='customPrimary' onClick={() => goToNextStage()}>
            Next
          </Button>
        </Row>
      </div> */}
      {/* <Modal show={showModal} onHide={handleClose} centered>
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
          <Button variant='dashboardBlueOnWhite' onClick={() => addUserToWhiteList()}>
            Next
          </Button>
        </Modal.Footer>
      </Modal> */}
    </>
  );
};

const mapStateToProps = (state) => ({
  // admissionUserArray: getAdmissionUserArray(state),
  clientId: getClientId(state),
  clientUserId: getClientUserId(state),
  admissionBatchDate: getAdmissionBatchDate(state),
  admissionBatchDescription: getAdmissionBatchDescription(state),
  admissionBatchName: getAdmissionBatchName(state),
});

// const mapDispatchToProps = (dispatch) => {
//   return {
//     setAdmissionSubjectArrayToStore: (payload) => {
//       dispatch(admissionActions.setAdmissionSubjectArrayToStore(payload));
//     },
//     setAdmissionClassIdToStore: (payload) => {
//       dispatch(admissionActions.setAdmissionClassIdToStore(payload));
//     },
//   };
// };

export default connect(mapStateToProps)(SelectClass);

SelectClass.propTypes = {
  // setAdmissionClassIdToStore: PropTypes.func.isRequired,
  // setAdmissionSubjectArrayToStore: PropTypes.func.isRequired,
  // admissionUserArray: PropTypes.instanceOf(Array).isRequired,
  clientId: PropTypes.number.isRequired,
  clientUserId: PropTypes.number.isRequired,
  admissionBatchName: PropTypes.string.isRequired,
  admissionBatchDescription: PropTypes.string.isRequired,
  admissionBatchDate: PropTypes.instanceOf(Date).isRequired,
  history: PropTypes.instanceOf(Object).isRequired,
};
