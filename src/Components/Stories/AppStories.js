import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Stories from 'react-insta-stories';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Send from '@material-ui/icons/Send';
import AddPhotoAlternate from '@material-ui/icons/AddPhotoAlternate';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import userImage from '../../assets/images/user.svg';
import { get, post, apiValidation, uploadFiles } from '../../Utilities';
import Cropper from '../Common/CropperModal/Cropper';
import { getUserProfile } from '../../redux/reducers/userProfile.reducer';
import { getClientId, getClientUserId } from '../../redux/reducers/clientUserId.reducer';
import './AppStories.scss';

const AppStories = (props) => {
  const {
    clientId,
    clientUserId,
    userProfile: { profileImage },
  } = props;
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [story, setStory] = useState([]);
  const [statusArray, setStatusArray] = useState([]);
  const [upImg, setUpImg] = useState(null);
  const [imageModal, setImageModal] = useState(false);
  const [displayIndex, setDisplayIndex] = useState(0);

  const fileSelectorRef = useRef(null);
  // const story = [
  //   {
  //     url: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1547033579',
  //     duration: 3000,
  //     currentIndex: 0,
  //   },
  //   {
  //     url: 'https://s3.ap-south-1.amazonaws.com/ingenium-question-images/1642707442124.jpg',
  //     duration: 3000,
  //     currentIndex: 1,
  //   },
  //   {
  //     url: 'https://assets.coingecko.com/coins/images/825/large/binance-coin-logo.png?1547034615',
  //     duration: 3000,
  //     currentIndex: 2,
  //   },
  //   {
  //     url: 'https://i.imgur.com/FwcWFeX.jpg',
  //     duration: 3000,

  //     currentIndex: 3,
  //   },
  // ];
  const storyStart = (index) => {
    console.log('Story Started', index);
  };

  const storyEnd = (index) => {
    console.log('Story ended', index);
  };

  const openFilePicker = () => {
    const accept = 'image/png,image/jpeg,image/jpg,video/mp4,audio/mp3';
    fileSelectorRef.current.accept = accept;
    fileSelectorRef.current.click();
  };

  useEffect(() => {
    get({ client_id: clientId, client_user_id: clientUserId }, '/getAllStatusForAUser').then(
      (res) => {
        const result = apiValidation(res);
        console.log(result, 'getAllStatusForAUser');
        // const temp = [...result, ...result, ...result];
        setStatusArray(result);
      },
    );
  }, []);

  const openClickedStory = (ele) => {
    const newStory = statusArray.find((elem) => elem[0].client_user_id === ele[0].client_user_id);
    const formattedStory = newStory.map((stry, index) => {
      stry.url = stry.file_url;
      stry.duration = 3000;
      stry.currentIndex = index;
      stry.type = stry.file_type;
      stry.header = {
        heading: `${stry.first_name} ${stry.last_name}`,
        profileImage: stry.profile_image,
      };
      return stry;
    });
    console.log(formattedStory);
    setStory(formattedStory);
    setModalOpen(true);
  };

  const addStatusByUser = () => {
    const payload = { client_user_id: clientUserId };
    console.log(selectedFiles);
    if (selectedFiles?.length > 0) {
      const formatAttachments = (array) => array?.map((a) => a);
      uploadFiles(selectedFiles).then((resp) => {
        console.log('response incoming');
        console.log(resp);
        console.log(selectedFiles);
        const sortedAttachmentsArray = [];
        for (const file of selectedFiles) {
          const sortedEle = resp.attachments_array.find(
            (ele) => ele.name.split('|')[0] === file.file.name,
          );
          sortedEle.file_url = sortedEle.url;
          sortedEle.file_type = sortedEle.type;
          sortedAttachmentsArray.push(sortedEle);
        }
        const attachments = JSON.stringify(formatAttachments(sortedAttachmentsArray));
        payload.file_array = attachments;
        post(payload, '/addStatus').then((res) => {
          console.log(res);
          setSelectedFiles([]);
        });
      });
    }
  };

  const saveFiles = () => {
    const files = [...selectedFiles];
    console.log(fileSelectorRef.current.files[0]);
    let fileType = 'image';
    if (fileSelectorRef.current.files[0].type.includes('video')) {
      fileType = 'video';
    }
    files.push({
      file: fileSelectorRef.current.files[0],
      type: fileType,
      path: URL.createObjectURL(fileSelectorRef.current.files[0]),
    });
    setSelectedFiles(files);
    setImageModal(true);
  };

  const closeModal = () => setModalOpen(false);
  const handleClose = () => setImageModal(false);
  const incrementDisplayIndex = () =>
    setDisplayIndex((prev) => {
      if (prev < selectedFiles.length - 1) {
        return prev + 1;
      }
      return prev;
    });
  const decrementDisplayIndex = () =>
    setDisplayIndex((prev) => {
      if (prev > 0) {
        return prev - 1;
      }
      return prev;
    });

  return (
    <>
      {false && (
        <div>
          <h1>click on the button to open the modal.</h1>
          <button type='button' className='openModalBtn' onClick={() => setModalOpen(true)}>
            Open
          </button>
          <button type='button' onClick={() => openFilePicker()}>
            add image
          </button>
          <button type='button' onClick={addStatusByUser}>
            post
          </button>
          <input
            type='file'
            className='d-none'
            ref={fileSelectorRef}
            onChange={(e) => saveFiles()}
          />{' '}
        </div>
      )}
      {/* <Cropper
        sourceImage={selectedFiles[0]}
        imageModal={imageModal}
        handleClose={handleClose}
        setProfileImage={addStatusByUser}
        aspectTop={1}
        aspectBottom={1}
      /> */}
      <Modal
        show={imageModal}
        onHide={handleClose}
        style={{ height: '100vh' }}
        className='d-flex justify-content-center filesModal widthControl'
      >
        <Modal.Header className='modalHeader' closeButton>
          Crop Image
        </Modal.Header>
        <Modal.Body
          style={{ width: `${selectedFiles.length * 100}%` }}
          className='imageModalFiles modalDivStories'
        >
          <div className='selectedImagesMapContainer'>
            {selectedFiles.map((ele) => {
              return (
                <div
                  style={{ transform: `translateX(-${displayIndex * 100}%)` }}
                  className='modalImageStories'
                >
                  <img className='modalSelectedImages' src={ele.path} />
                </div>
              );
            })}
          </div>
        </Modal.Body>
        <Modal.Footer className='SelectedPhotosModalFooter'>
          {selectedFiles.length > 1 && (
            <div className='modalNextPrev'>
              <button type='button' onClick={decrementDisplayIndex} className='buttonNone'>
                <ChevronLeft />
              </button>
              <button type='button' onClick={incrementDisplayIndex} className='buttonNone'>
                <ChevronRight />
              </button>
            </div>
          )}
          <div className='addCaptionContainer'>
            <button className='btnAddMorePhoto' type='button' onClick={openFilePicker}>
              <AddPhotoAlternate className='addMorePhoto' />
            </button>
            <input
              type='text'
              className='addCaptionContainerInput'
              placeholder='add caption'
              onChange={() => {}}
            />
          </div>
          <button type='button' className='addStatusButton' onClick={() => addStatusByUser()}>
            <Send />
          </button>
        </Modal.Footer>
      </Modal>
      <div className='scrollableStatuses'>
        {/* eslint-disable */}
        <div className='mr-1'>
          <div onClick={() => openFilePicker()} className='statusCircle mx-0'>
            <img className='statusProfileImage' src={profileImage || userImage} />
            <input
              type='file'
              className='d-none'
              ref={fileSelectorRef}
              onChange={(e) => saveFiles()}
            />
            <p className='plusMarkStories'>+</p>
          </div>
          <p className='statusUserName'>Add story</p>
        </div>
        {statusArray.map((ele) => {
          return (
            /* eslint-disable */
            <div className='mx-1'>
              <div
                onClick={() => openClickedStory(ele)}
                key={ele[0].client_user_id}
                className='statusCircle'
              >
                <img className='statusProfileImage' src={ele[0].profile_image || userImage} />
              </div>
              <p className='statusUserName'>{`${ele[0].first_name}`}</p>
            </div>
          );
        })}
      </div>
      {modalOpen && (
        <div className='d-flex NextAndPrevArrows'>
          <button type='button' className='buttonNone'>
            <ChevronLeft />
          </button>
          <button type='button' className='buttonNone'>
            <ChevronRight />
          </button>
        </div>
      )}
      <Modal
        show={modalOpen}
        onHide={() => setModalOpen(false)}
        centered
        style={{ height: '100vh' }}
        className='d-flex justify-content-center widthControl'
      >
        <Modal.Header
          className='mb-0 modalHeadStories modalHeader py-0'
          style={{ border: 'transparent' }}
          closeButton
        />

        <Modal.Body fullscreen className='modalDivStories'>
          <Stories
            width='100%'
            height='100%'
            stories={story}
            loop='true'
            onStoryStart={storyStart}
            onStoryEnd={storyEnd}
            onAllStoriesEnd={closeModal}
            keyboardNavigation
            styles={{ justifyContent: 'center' }}
          />
        </Modal.Body>
      </Modal>
    </>
  );
};

const mapStateToProps = (state) => ({
  clientUserId: getClientUserId(state),
  clientId: getClientId(state),
  userProfile: getUserProfile(state),
});

export default connect(mapStateToProps)(AppStories);

AppStories.propTypes = {
  clientId: PropTypes.number.isRequired,
  clientUserId: PropTypes.number.isRequired,
  userProfile: PropTypes.shape({
    profileImage: PropTypes.string,
  }).isRequired,
};
