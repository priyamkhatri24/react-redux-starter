/** @jsxImportSource @emotion/react */

import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import CreateIcon from '@material-ui/icons/Create';
import './DisplayPage.scss';
import { PageHeader, AspectCards } from '../Common';
import { getClientId } from '../../redux/reducers/clientUserId.reducer';
import { apiValidation, get } from '../../Utilities';
import { displayActions } from '../../redux/actions/displaypage.action';
import AdmissionStyle from '../Admissions/Admissions.style';
import '../Live Classes/LiveClasses.scss';
import '../Courses/Courses.scss';
import '../Profile/Profile.scss';

const DisplayPage = (props) => {
  const { clientId, history, setDisplayDataToStore } = props;
  const [formDetails, setFormDetails] = useState([]);
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    get({ client_id: clientId }, '/getHomepageContent').then((res) => {
      console.log(res);
      const result = apiValidation(res);
      setBanners(result);
      setFormDetails(res.client_info_array);
    });
  }, [clientId]);

  const goToEditProfile = () => {
    setDisplayDataToStore(formDetails);
    history.push('/displaypage/editprofile');
  };

  return (
    <>
      <PageHeader title='Display Page' />
      <div className='Display' style={{ marginTop: '4rem' }}>
        <Button variant='courseBlueOnWhite' style={{ width: '90%' }} className='d-block mx-auto'>
          Click here to preview display page
        </Button>

        <div css={AdmissionStyle.adminCard} className='p-2 m-3' style={{ position: 'relative' }}>
          <div
            className='Profile__edit text-center py-1'
            onClick={() => goToEditProfile()}
            role='button'
            onKeyDown={() => goToEditProfile()}
            tabIndex='-1'
          >
            <CreateIcon />
          </div>
          {formDetails.length > 0 &&
            formDetails
              .filter((e) => e.filled_detail)
              .map((elem) => {
                return (
                  <>
                    <h6 className='LiveClasses__adminHeading mb-0'>{elem.filled_detail}</h6>
                    <p className='LiveClasses__adminDuration'>{elem.name}</p>
                  </>
                );
              })}
        </div>

        {banners.map((elem) => {
          return (
            <React.Fragment key={elem.homepage_section_id}>
              <h5 style={{ fontFamily: 'Montserrat-Medium', lineHeight: '24px' }} className='m-3'>
                {elem.section_name}
              </h5>

              <AspectCards data={elem.file_array} />
            </React.Fragment>
          );
        })}
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  clientId: getClientId(state),
});

const mapDispatchToProps = (dispatch) => ({
  setDisplayDataToStore: (payload) => dispatch(displayActions.setDisplayDataToStore(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DisplayPage);

DisplayPage.propTypes = {
  clientId: PropTypes.number.isRequired,
  history: PropTypes.instanceOf(Object).isRequired,
  setDisplayDataToStore: PropTypes.func.isRequired,
};
