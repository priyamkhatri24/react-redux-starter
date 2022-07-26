import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Swal from 'sweetalert2';
import Modal from 'react-bootstrap/Modal';
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DeleteIcon from '@material-ui/icons/Delete';
import CreateIcon from '@material-ui/icons/Create';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Accordion from 'react-bootstrap/Accordion';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ReactIntlTelInput from 'react-intl-tel-input-v2';
import { PageHeader, BatchesSelector } from '../Common';
import { getAdmissionRoleArray } from '../../redux/reducers/admissions.reducer';
import { admissionActions } from '../../redux/actions/admissions.action';
import { getClientId } from '../../redux/reducers/clientUserId.reducer';
import { apiValidation, get, post } from '../../Utilities';
import 'intl-tel-input/build/css/intlTelInput.css';
import '../Courses/Courses.scss';
import '../Profile/Profile.scss';
import UsersDataCard from './UsersDataCard';

const AddDetails = (props) => {
  const { history, admissionRoleArray, clientId } = props;

  const addRef = useRef(null);
  const [usersModal, setUsersModal] = useState(false);
  const [existingUsers, setExistingUsers] = useState([]);
  const [details, setDetails] = useState(
    admissionRoleArray[0] === '1'
      ? {
          name: '',
          contact: { iso2: 'in', dialCode: '91', phone: '' },
          parent_contact: '',
          parent_name: '',
          isEditing: false,
        }
      : { name: '', contact: { iso2: 'in', dialCode: '91', phone: '' }, isEditing: false },
  );

  const [arrayEdit, setArrayEdit] = useState(
    admissionRoleArray[0] === '1'
      ? {
          id: new Date().getTime(),
          name: '',
          contact: { iso2: 'in', dialCode: '91', phone: '' },
          parent_contact: '',
          parent_name: '',
          parent_country_code: '',
          isEditing: false,
        }
      : {
          id: new Date().getTime(),
          name: '',
          contact: { iso2: 'in', dialCode: '91', phone: '' },
          isEditing: false,
        },
  );

  const [detailArray, setDetailArray] = useState([]);
  const [isValid, setValid] = useState(false);

  const inputProps = {
    placeholder: 'Mobile Number',
  };

  const parentInputProps = {
    placeholder: "Parent's Mobile Number",
  };

  const intlTelOpts = {
    preferredCountries: ['in'],
  };

  /** ****************************Batches Modal Logic***************************** */

  const [showModal, setShowModal] = useState(false);
  const [batches, setBatches] = useState([]);
  const [selectedBatches, setSelectedBatches] = useState([]);
  const handleClose = () => setShowModal(false);
  const handleUsersClose = () => setUsersModal(false);
  const handleOpen = () => setShowModal(true);
  const handleUsersOpen = () => setUsersModal(true);
  const getSelectedBatches = (selectBatches) => {
    setSelectedBatches(selectBatches);
  };

  useEffect(() => {
    get({ client_id: clientId }, '/getAllBatchesOfCoaching').then((res) => {
      console.log(res);
      const result = apiValidation(res);
      setBatches(result);
      console.log('heelo');
    });
  }, [clientId]);

  const showUserPromptForRepeatedNumberAddition = (userArray) => {
    console.log(userArray);

    return userArray;
  };

  const addUserToWhiteList = () => {
    const payload = {
      client_id: clientId,
      user_array: JSON.stringify(
        detailArray.map((e) => {
          const phoneNo = e.contact.phone;
          const countryCode = e.contact.dialCode;
          const parentContact = e.parent_contact?.phone;
          return {
            ...e,
            contact: phoneNo,
            country_code: countryCode,
            parent_contact: parentContact,
          };
        }),
      ),
      role_array: JSON.stringify(admissionRoleArray),
      batch_array: JSON.stringify(selectedBatches.map((e) => e.client_batch_id)),
    };
    console.log(payload);
    Swal.fire({
      title: 'Add Users',
      text: 'Do you wish to add the User(s)?',
      icon: 'question',
      confirmButtonText: `Yes`,
      showDenyButton: true,
      customClass: 'Assignments__SweetAlert',
    }).then((resp) => {
      if (resp.isConfirmed) {
        post(payload, '/addMultipleUsersInWhiteList').then((res) => {
          if (res.success) {
            history.push('/admissions');
          }
        });
      }
    });
  };
  /** ********************************************************************* */

  const checkIfUserWithContactAlreadyExists = (user) => {
    console.log(user, 'newly added');
    const payload = {
      client_id: clientId,
      contact: user.contact.phone,
    };
    return get(payload, '/getUsersOfContact').then((res) => {
      const result = apiValidation(res);
      return result;
    });
  };

  const addToDetailArray = (checked = false) => {
    console.log(detailArray, details);
    // if (!details.contact.phone) return;
    checkIfUserWithContactAlreadyExists(details).then((users) => {
      console.log(users);
      if (!users.length || (users.length && checked)) {
        const filteredDetails = Object.values(details).filter((e) => e !== '');
        if (admissionRoleArray[0] === '1' && filteredDetails.length === 5) {
          if (
            users.find((ele) => {
              return ele.first_name === details.name;
            })
          ) {
            Swal.fire({
              title: 'Oops',
              text:
                'User with this name and contact already exists! Please try a different name or contact.',
              icon: 'error',
              confirmButtonText: `Okay`,
              customClass: 'Assignments__SweetAlert',
            });
            return;
          }
          setDetailArray((e) => [...e, { ...details, id: new Date().getTime() }]);
          setValid(false);
          setDetails({
            name: '',
            contact: { iso2: 'in', dialCode: '91', phone: '' },
            parent_contact: '',
            parent_name: '',
            isEditing: false,
          });
        } else if (
          (admissionRoleArray[0] === '3' || admissionRoleArray[0] === '4') &&
          filteredDetails.length === 3
        ) {
          setDetailArray((e) => [...e, { ...details, id: new Date().getTime() }]);
          setValid(false);
          setDetails({
            name: '',
            contact: { iso2: 'in', dialCode: '91', phone: '' },
            isEditing: false,
          });
        } else setValid(true);
      } else {
        // remove user from details array
        console.log('user already exists', users);
        setExistingUsers(users);
        handleUsersOpen();
      }
    });
  };

  const removeStudent = (id) => {
    const updatedDetails = detailArray.filter((e) => e.id !== id);
    setDetailArray(updatedDetails);
  };

  const editStudent = (id) => {
    const updatedDetails = detailArray
      .map((e) => {
        const newObj = { ...e, isEditing: false };
        return newObj;
      })
      .map((e) => {
        if (e.id === id) {
          setArrayEdit(e);
          console.log(e, 'wut');
          e.isEditing = true;
        }
        return e;
      });
    console.log(updatedDetails, 'updateddetails');
    setDetailArray(updatedDetails);
  };

  const emptyArrayEdit = (id) => {
    setArrayEdit({});
    const updatedDetails = detailArray.map((e) => {
      const newObj = { ...e, isEditing: false };
      return newObj;
    });
    setDetailArray(updatedDetails);
  };

  const addArrayEditToDetailArray = () => {
    const updatedArray =
      admissionRoleArray === '1'
        ? detailArray.map((elem) => {
            if (elem.id === arrayEdit.id) {
              elem.name = arrayEdit.name;
              elem.contact = { ...arrayEdit.contact };
              elem.parent_contact = arrayEdit.parent_contact;
              elem.parent_name = arrayEdit.parent_name;
              elem.isEditing = false;
            }
            return elem;
          })
        : detailArray.map((elem) => {
            if (elem.id === arrayEdit.id) {
              elem.name = arrayEdit.name;
              elem.contact = { ...arrayEdit.contact };
              elem.isEditing = false;
            }
            return elem;
          });

    console.log(updatedArray);
    setDetailArray(updatedArray);
    setArrayEdit({});
  };

  const goToNextStage = () => {
    addRef.current.click();
    // if (admissionRoleArray[0] === '1') {
    //   if (detailArray.length > 0 && detailArray.length <= 20) {
    //     setAdmissionUserArrayToStore(detailArray);
    //     history.push('/admissions/add/class');
    //   } else {
    //     console.log('not 0 or more than 20');
    //   }
    // } else {
    //   handleOpen();
    // }
    checkIfUserWithContactAlreadyExists(details).then((users) => {
      if (!users || (users && !users.length)) {
        handleOpen();
      }
    });
  };

  return (
    <>
      <PageHeader title='Add Details' />
      <div style={{ marginTop: '5rem' }}>
        {detailArray.length > 0 &&
          detailArray.map((e) => {
            return e.isEditing ? (
              <Card className='LiveClasses__Card mx-auto p-3 m-2' style={{ width: '90%' }}>
                <Row>
                  <Col xs={2}>
                    <PersonOutlineIcon />
                  </Col>
                  <Col xs={10}>
                    <label className='has-float-label my-auto'>
                      <input
                        className='form-control'
                        name='First Name'
                        type='text'
                        placeholder='First Name'
                        value={arrayEdit.name}
                        onChange={(elem) => {
                          const newObject = {
                            ...arrayEdit,
                            name: elem.target.value,
                          };
                          setArrayEdit(newObject);
                        }}
                      />
                      <span>First Name</span>
                    </label>
                    {/* <label className='has-float-label my-auto mt-3'>
                      <input
                        className='form-control mt-3'
                        name='Mobile Number'
                        type='number'
                        placeholder='Mobile Number'
                        value={arrayEdit.contact.phone}
                        onChange={(elem) => {
                          const newObject = {
                            ...arrayEdit,
                            contact: { ...arrayEdit.contact, phone: elem.target.value },
                          };
                          setArrayEdit(newObject);
                        }}
                      />
                      <span>Mobile Number</span>
                    </label> */}

                    <ReactIntlTelInput
                      inputProps={inputProps}
                      intlTelOpts={intlTelOpts}
                      value={arrayEdit.contact}
                      onChange={(elem) => {
                        const newObject = {
                          ...arrayEdit,
                          contact: elem,
                        };
                        setArrayEdit(newObject);
                        console.log(newObject, 'abc');
                      }}
                      className='mt-3'
                    />

                    {admissionRoleArray[0] === '1' && (
                      <>
                        <label className='has-float-label my-auto mt-3'>
                          <input
                            className='form-control mt-3'
                            name="Parent's Name"
                            type='text'
                            placeholder="Parent's Name"
                            value={arrayEdit.parent_name}
                            onChange={(elem) => {
                              const newObject = {
                                ...arrayEdit,
                                parent_name: elem.target.value,
                              };
                              setArrayEdit(newObject);
                            }}
                          />
                          <span>Parent&apos;s Name</span>
                        </label>
                        {/* <label className='has-float-label my-auto mt-3'>
                          <input
                            className='form-control mt-3'
                            name="Parent's Mobile Number"
                            type='number'
                            min={10}
                            max={10}
                            placeholder="Parent's Mobile Number"
                            value={arrayEdit.parent_contact}
                            onChange={(elem) => {
                              const newObject = {
                                ...arrayEdit,
                                parent_contact: elem.target.value,
                              };
                              setArrayEdit(newObject);
                            }}
                          />
                          <span>Parent&apos;s Mobile Number</span>
                        </label> */}
                        <ReactIntlTelInput
                          inputProps={parentInputProps}
                          intlTelOpts={intlTelOpts}
                          value={arrayEdit.parent_contact}
                          onChange={(elem) => {
                            const newObject = {
                              ...arrayEdit,
                              parent_contact: elem,
                            };
                            setArrayEdit(newObject);
                            console.log(newObject, 'abc');
                          }}
                          className='mt-3'
                        />
                      </>
                    )}
                  </Col>
                </Row>
                <Row className='ml-auto m-3'>
                  <Button variant='boldTextSecondary' onClick={() => emptyArrayEdit(e.id)}>
                    Cancel
                  </Button>
                  <Button variant='boldText' onClick={() => addArrayEditToDetailArray()}>
                    Next
                  </Button>
                </Row>
                {isValid && (
                  <small className='text-danger d-block'>Please Fill all Required fields</small>
                )}
              </Card>
            ) : (
              <Accordion key={e.id}>
                <Card className='Courses__accordionHeading m-3'>
                  <Accordion.Toggle as='div' eventKey='0'>
                    <Row className='m-2'>
                      <Col xs={2}>
                        <PersonOutlineIcon />
                      </Col>
                      <Col xs={7}>
                        <span>{e.name}</span>
                      </Col>
                      <span className='ml-auto'>
                        <ExpandMoreIcon />
                      </span>
                    </Row>
                  </Accordion.Toggle>
                  <Accordion.Collapse eventKey='0'>
                    <div
                      className='LiveClasses__adminCard p-2 m-2'
                      style={{ position: 'relative', border: 'none' }}
                    >
                      <div
                        className='Courses__edit text-center py-1'
                        onClick={() => editStudent(e.id)}
                        role='button'
                        onKeyDown={() => editStudent(e.id)}
                        tabIndex='-1'
                      >
                        <CreateIcon />
                      </div>
                      <div
                        className='Profile__edit text-center py-1'
                        onClick={() => removeStudent(e.id)}
                        role='button'
                        onKeyDown={() => removeStudent(e.id)}
                        tabIndex='-1'
                      >
                        <DeleteIcon />
                      </div>

                      <h6 className='LiveClasses__adminHeading mb-0'>Name</h6>
                      <p className='LiveClasses__adminDuration '>{e.name}</p>

                      <h6 className='LiveClasses__adminHeading mb-0'>Mobile Number</h6>
                      <p className='LiveClasses__adminDuration '>{e.contact.phone}</p>

                      {e.parent_name && (
                        <>
                          <h6 className='LiveClasses__adminHeading mb-0'>Parent&apos;s Name</h6>
                          <p className='LiveClasses__adminDuration '>{e.parent_name}</p>
                        </>
                      )}
                      {e.parent_contact && (
                        <>
                          <h6 className='LiveClasses__adminHeading mb-0'>
                            Parent&apos;s Mobile Number
                          </h6>
                          <p className='LiveClasses__adminDuration '>{e.parent_contact.phone}</p>
                        </>
                      )}
                    </div>
                  </Accordion.Collapse>
                </Card>
              </Accordion>
            );
          })}
        <Card className='LiveClasses__Card mx-auto p-3' style={{ width: '90%' }}>
          <Row>
            <Col xs={2}>
              <PersonOutlineIcon />
            </Col>
            <Col xs={10}>
              <label className='has-float-label my-auto'>
                <input
                  className='form-control'
                  name='First Name'
                  type='text'
                  placeholder='First Name'
                  value={details.name}
                  onChange={(e) => {
                    const newObject = {
                      ...details,
                      name: e.target.value,
                    };
                    setDetails(newObject);
                  }}
                />
                <span>First Name</span>
              </label>
              {/* <label className='has-float-label my-auto mt-3'>
                <input
                  className='form-control mt-3'
                  name='Mobile Number'
                  type='number'
                  placeholder='Mobile Number'
                  value={details.contact.phone}
                  onChange={(e) => {
                    const newObject = {
                      ...details,
                      contact: { ...details.contact, phone: e.target.value },
                    };
                    setDetails(newObject);
                  }}
                />
                <span>Mobile Number</span>
              </label> */}

              <ReactIntlTelInput
                inputProps={inputProps}
                intlTelOpts={intlTelOpts}
                value={details.contact}
                onChange={(e) => {
                  const newObject = {
                    ...details,
                    contact: e,
                  };
                  setDetails(newObject);
                }}
                className='mt-3'
              />

              {admissionRoleArray[0] === '1' && (
                <>
                  <label className='has-float-label my-auto mt-3'>
                    <input
                      className='form-control mt-3'
                      name="Parent's Name"
                      type='text'
                      placeholder="Parent's Name"
                      value={details.parent_name}
                      onChange={(e) => {
                        const newObject = {
                          ...details,
                          parent_name: e.target.value,
                        };
                        setDetails(newObject);
                      }}
                    />
                    <span>Parent&apos;s Name</span>
                  </label>
                  {/* <label className='has-float-label my-auto mt-3'>
                    <input
                      className='form-control mt-3'
                      name="Parent's Mobile Number"
                      type='number'
                      min={10}
                      max={10}
                      placeholder="Parent's Mobile Number"
                      value={details.parent_contact}
                      onChange={(e) => {
                        const newObject = {
                          ...details,
                          parent_contact: e.target.value,
                        };
                        setDetails(newObject);
                      }}
                    />
                    <span>Parent&apos;s Mobile Number</span>
                  </label> */}
                  <ReactIntlTelInput
                    inputProps={parentInputProps}
                    intlTelOpts={intlTelOpts}
                    value={details.parent_contact}
                    onChange={(e) => {
                      const newObject = {
                        ...details,
                        parent_contact: e,
                      };
                      setDetails(newObject);
                    }}
                    className='mt-3'
                  />
                </>
              )}
            </Col>
          </Row>
          <Button
            variant='boldText'
            className='ml-auto mt-3'
            onClick={() => addToDetailArray()}
            ref={addRef}
          >
            Add
          </Button>
          {isValid && (
            <small className='text-danger d-block'>Please Fill all Required fields</small>
          )}
        </Card>
        <Row className='justify-content-center m-4'>
          <Button variant='customPrimary' onClick={() => goToNextStage()}>
            Next
          </Button>
        </Row>
      </div>
      <Modal show={showModal} onHide={handleClose} centered>
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
      </Modal>

      <Modal show={usersModal} onHide={handleUsersClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>User(s) Already exists with this contact</Modal.Title>
        </Modal.Header>
        {existingUsers.map((ele) => {
          const roleId = ele.role_id;
          ele.role_id = String(roleId);
          return <UsersDataCard noRedirect elem={ele} withStatus />;
        })}
        <Modal.Footer>
          <Button variant='dashboardBlueOnWhite' onClick={() => handleUsersClose()}>
            Add another contact
          </Button>
          <Button
            variant='dashboardBlueOnWhite'
            onClick={() => {
              addToDetailArray(true);
              handleUsersClose();
            }}
          >
            Proceed adding this contact
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

const mapStateToProps = (state) => ({
  admissionRoleArray: getAdmissionRoleArray(state),
  clientId: getClientId(state),
});

const mapDispatchToProps = (dispatch) => {
  return {
    setAdmissionUserArrayToStore: (payload) => {
      dispatch(admissionActions.setAdmissionUserArrayToStore(payload));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddDetails);

AddDetails.propTypes = {
  history: PropTypes.instanceOf(Object).isRequired,
  admissionRoleArray: PropTypes.instanceOf(Array).isRequired,
  clientId: PropTypes.number.isRequired,
};
