/** @jsxImportSource @emotion/react */

import React, { useCallback, useEffect, useState, useRef } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import CreateIcon from '@material-ui/icons/Create';
import Modal from 'react-bootstrap/Modal';
import Swal from 'sweetalert2';
import './DisplayPage.scss';
import { PageHeader, AspectCards, DraggableAspectCards } from '../Common';
import BottomNavigation from '../Common/BottomNavigation/BottomNavigation';
import { getClientId, getClientUserId } from '../../redux/reducers/clientUserId.reducer';
import {
  apiValidation,
  get,
  post,
  propComparator,
  verifyIsImage,
  verifyIsVideo,
} from '../../Utilities';
import { uploadingImage } from '../../Utilities/customUpload';
import { displayActions } from '../../redux/actions/displaypage.action';
import AdmissionStyle from '../Admissions/Admissions.style';
import '../Live Classes/LiveClasses.scss';
import '../Courses/Courses.scss';
import '../Profile/Profile.scss';
import Cropper from '../Common/CropperModal/Cropper';

const DisplayPage = (props) => {
  const { clientId, history, setDisplayDataToStore, clientUserId } = props;
  const [formDetails, setFormDetails] = useState([]);
  const [banners, setBanners] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [modalFile, setModalFile] = useState('');
  const openDeleteModal = (elem) => {
    setShowModal(true);
    setModalFile(elem);
  };
  const closeDeleteModal = () => setShowModal(false);

  const [cropperImageModal, setCropperImageModal] = useState(false);
  const [currentSection, setCurrentSection] = useState({});
  const profileImageRef = useRef(null);
  const [upImg, setUpImg] = useState();

  const handleCropperClose = () => setCropperImageModal(false);
  const handleCropperOpen = () => setCropperImageModal(true);

  const getHomepageContent = useCallback(() => {
    const apipayload = {
      client_id: clientId,
      client_user_id: clientUserId,
    };
    get(apipayload, '/getHomepageContent').then((res) => {
      console.log(res);
      const result = apiValidation(res);
      setBanners(result);
      setFormDetails(res.client_info_array);
    });
  }, [clientId, clientUserId]);

  useEffect(() => {
    getHomepageContent();
  }, [getHomepageContent]);

  const goToEditProfile = () => {
    setDisplayDataToStore(formDetails);
    history.push('/displaypage/editprofile');
  };

  const deleteFile = () => {
    post({ file_id: modalFile.homepage_section_file_id }, '/deleteFileFromHomepageSection').then(
      (res) => {
        console.log(res);
        getHomepageContent();
        closeDeleteModal();
      },
    );
  };

  function reverse(s) {
    return [...s].reverse().join('');
  }
  const addNewFile = (file, type = 'image') => {
    console.log(file, 'fileeee');
    const payload = {
      client_user_id: clientUserId,
      file_type: type,
      file_link: file,
      section_id: currentSection.homepage_section_id,
      priority_order: (currentSection.file_array.length + 1).toString(),
    };

    post(payload, '/addFileToHomePageSection').then((res) => {
      console.log(res);
      getHomepageContent();
    });
    // console.log(payload);
  };

  const onSelectFile = (e) => {
    let isFileAllowed = false;
    const file = e.target.files[0];
    console.log(file);

    const s = reverse(reverse(file.name).split('.')[0]);
    if (verifyIsImage.test(s) || verifyIsVideo.test(s)) isFileAllowed = true;
    const type = file.type.split('/')[0];
    if (file && isFileAllowed) {
      const reader = new FileReader();
      reader.addEventListener('load', () => setUpImg(reader.result));
      reader.readAsDataURL(e.target.files[0]);
      if (type === 'image') {
        handleCropperOpen();
      } else if (type === 'video') {
        uploadingImage(file).then((res) => {
          console.log('videooolod ', res);
          addNewFile(res.filename, 'video');
        });
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Invalid File Type!',
        text: `The supported file types are ${
          type === 'image'
            ? 'gif, jpeg, jpg, tiff, png, webp, bmp'
            : type === 'video'
            ? 'mov,mp3, mp4 , mpg, avi, wmv, flv, 3gp'
            : 'doc, docx, xls, xlsx, ppt, pptx, txt, pdf'
        }`,
      });
    }
  };

  const handleDrag = (result) => {
    console.log(result, 'hp');
    // console.log(data);
    // // let temp1;
    // const temp = data[result.source.index];
    // data[result.source.index] = data[result.destination.index];
    // data[result.destination.index] = temp;
  };

  return (
    <>
      <PageHeader shadow title='Display Page' />
      <div className='Display' style={{ marginTop: '4rem', marginBottom: '1rem' }}>
        <div>
          <Button
            variant='courseBlueOnWhite'
            style={{ marginBottom: '1rem' }}
            className='d-block mx-auto Display__preview'
            onClick={() => history.push('/displaypage/preview')}
          >
            Click here to preview display page
          </Button>
        </div>

        <div css={AdmissionStyle.adminCard} className='p-2' style={{ position: 'relative' }}>
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
                  <React.Fragment key={elem.name}>
                    <h6 className='Display__details mb-0'>{elem.filled_detail}</h6>
                    <p className='Display__name'>{elem.name}</p>
                  </React.Fragment>
                );
              })}
        </div>

        {banners.sort(propComparator('homepage_section_id')).map((elem) => {
          const addCard = (section) => {
            profileImageRef.current.click();
            setCurrentSection(section);
          };

          return (
            <React.Fragment key={elem.homepage_section_id}>
              <h5 style={{ fontFamily: 'Montserrat-Medium', lineHeight: '24px' }} className='m-3'>
                {elem.section_name}
              </h5>

              <DraggableAspectCards
                data={elem.file_array}
                clickCard={openDeleteModal}
                clickAddCard={addCard}
                section={elem}
                // handleDrag={handleDrag}
              />

              <Cropper
                aspectTop={16}
                aspectBottom={9}
                imageModal={cropperImageModal}
                handleClose={handleCropperClose}
                setProfileImage={addNewFile}
                sourceImage={upImg}
              />
            </React.Fragment>
          );
        })}

        <input
          type='file'
          name='upload-photo'
          id='upload-photo'
          onChange={onSelectFile}
          style={{ display: 'none' }}
          ref={profileImageRef}
        />
      </div>

      <Modal show={showModal} onHide={closeDeleteModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Selected File</Modal.Title>
        </Modal.Header>
        <Modal.Body className=' mx-auto'>
          {modalFile.file_type === 'video' ? (
            /* eslint-disable */
            <video
              width='inherit'
              className='testimonialVideoTag'
              controls='controls'
              autoplay='autoplay'
            >
              <source src={modalFile.file_link} type='video/mp4' />
              <track src='' kind='subtitles' srcLang='en' label='English' />
            </video>
          ) : (
            <img src={modalFile.file_link} alt='file' className='img-fluid' />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant='boldTextSecondary' onClick={() => closeDeleteModal()}>
            Cancel
          </Button>
          <Button variant='boldText' onClick={() => deleteFile()}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      <BottomNavigation activeNav='displayPage' history={history} />
    </>
  );
};

const mapStateToProps = (state) => ({
  clientId: getClientId(state),
  clientUserId: getClientUserId(state),
});

const mapDispatchToProps = (dispatch) => ({
  setDisplayDataToStore: (payload) => dispatch(displayActions.setDisplayDataToStore(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DisplayPage);

DisplayPage.propTypes = {
  clientId: PropTypes.number.isRequired,
  history: PropTypes.instanceOf(Object).isRequired,
  setDisplayDataToStore: PropTypes.func.isRequired,
  clientUserId: PropTypes.number.isRequired,
};
