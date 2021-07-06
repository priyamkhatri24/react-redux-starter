import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { apiValidation, get, post } from '../../Utilities';
import UserDataCard from '../Admissions/UsersDataCard';
import { PageHeader } from '../Common';
import { getClientId, getClientUserId } from '../../redux/reducers/clientUserId.reducer';
import './Fees.scss';

const FeeUserDetails = (props) => {
  const { history, clientId, clientUserId } = props;

  const [users, setUsers] = useState([]);
  const [title, setTitle] = useState('');

  useEffect(() => {
    setTitle(history.location.state.batchName);
    get({ client_batch_id: history.location.state.batchId }, '/getFeeDataForBatch').then((res) => {
      console.log(res);
      const result = apiValidation(res);
      setUsers(result);
    });
  }, [history]);

  const notifyFeeUser = (userId, receiverId) => {
    const payload = {
      user_id: userId,
      title: 'Fee',
      topic:
        process.env.NODE_ENV === 'development'
          ? `developmentuser${receiverId}`
          : `productionuser${receiverId}`,
      sender_id: clientUserId,
      client_id: clientId,
      reciever_id: receiverId,
    };

    post(payload, '/notifyStudentForFee').then((res) => {
      if (res.success) {
        get({ client_batch_id: history.location.state.batchId }, '/getFeeDataForBatch').then(
          (resp) => {
            const result = apiValidation(resp);
            setUsers(result);
          },
        );
      }
    });
  };

  const goToFeePlan = (elem) => {
    history.push({
      pathname: '/fees/students',
      state: { studentData: elem },
    });
  };

  return (
    <>
      <PageHeader title={title} />
      <div className='Fees__userDetails'>
        {users.length > 0 &&
          users.map((elem) => {
            return (
              <UserDataCard
                elem={elem}
                FeeUser
                history={history}
                key={elem.user_id}
                notifyFeeUser={notifyFeeUser}
                goToFeePlan={goToFeePlan}
              />
            );
          })}
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  clientId: getClientId(state),
  clientUserId: getClientUserId(state),
});

export default connect(mapStateToProps)(FeeUserDetails);

FeeUserDetails.propTypes = {
  history: PropTypes.instanceOf(Object).isRequired,
  clientId: PropTypes.number.isRequired,
  clientUserId: PropTypes.number.isRequired,
};
