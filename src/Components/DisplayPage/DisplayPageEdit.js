import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { PageHeader } from '../Common';
import FormTemplate from '../Common/DynamicForm/FormTemplate';
import { validation } from './Validation';
import { dataArray } from './DisplayData';
import { getCurrentDisplayData } from '../../redux/reducers/displaypage.reducer';
import { getClientId } from '../../redux/reducers/clientUserId.reducer';
import { post } from '../../Utilities';
import tempData from './temp_data';

const DisplayPageEdit = (props) => {
  const { displayData, clientId, history } = props;
  const [inputData, setInputData] = useState([]);

  const getDynamicData = (data) => {
    const payload = {
      tagline: data.Tagline,
      about: data['About Us'],
      email: data.email,
      contact: data.Phone,
      address: data.Address,
      city: data.City,
      state: data.State,
      facebook_link: data.Facebook,
      instagram_link: data.Instagram,
      telegram_link: data.Telegram,
      whatsapp_link: data.Whatsapp,
      linkedin_link: data.Linkedin,
      youtube_link: data.Youtube,
      other_link: data.Others,
      client_id: clientId,
    };

    console.log(payload);

    post(payload, '/editHomePageDetails').then((res) => {
      console.log(res);
      if (res.success) history.push('/displaypage');
    });
  };

  useEffect(() => {
    const moddedData = displayData.reduce(
      (obj, item) => ({ ...obj, [item.name]: item.filled_detail || '' }),
      {},
    );

    console.log(moddedData);

    const valueData = dataArray.map((elem) => {
      elem.value = moddedData[elem.name];
      return elem;
    });

    // valueData.push({AboutUs : })

    setInputData(tempData);
  }, [displayData]);

  return (
    <>
      <PageHeader title='Edit Info' />
      <div style={{ marginTop: '5rem' }}>
        {inputData.length > 0 && (
          <FormTemplate fields={inputData} validation={validation} getData={getDynamicData} />
        )}
        {/* <Formik
          initialValues={{ Tagline: 'jared' }}
          onSubmit={(values, actions) => {
            setTimeout(() => {
              alert(JSON.stringify(values, null, 2));
              actions.setSubmitting(false);
            }, 1000);
          }}
          validationSchema={validation}
        >
          {(prop) => (
            <form onSubmit={prop.handleSubmit} className='mx-3'>
              <label className='has-float-label my-auto'>
                <input
                  className='form-control'
                  name='Tagline'
                  type='text'
                  placeholder='Tagline'
                  onChange={prop.handleChange}
                  onBlur={prop.handleBlur}
                  value={prop.values.Tagline}
                />
                <span>Tagline</span>
                <small className='input-count' style={{marginT}}>36</small>
              </label>
              <span
                style={{
                  fontSize: '14px',
                  color: 'rgba(0, 0, 0, 0.54)',
                  lineHeight: '18px',
                  fontFamily: 'Montserrat-Medium',
                  textAlign: 'left',
                }}
              >
                Enter an attractive tag line for your brand.
              </span>

              {prop.errors.name && <div id='feedback'>{prop.errors.name}</div>}
              <button type='submit'>Submit</button>
            </form>
          )}
        </Formik> */}
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  displayData: getCurrentDisplayData(state),
  clientId: getClientId(state),
});

export default connect(mapStateToProps)(DisplayPageEdit);

DisplayPageEdit.propTypes = {
  displayData: PropTypes.instanceOf(Array).isRequired,
  clientId: PropTypes.number.isRequired,
  history: PropTypes.instanceOf(Object).isRequired,
};
