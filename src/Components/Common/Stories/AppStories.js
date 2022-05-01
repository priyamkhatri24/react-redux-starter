import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Stories from 'react-insta-stories';
import ReactPlayer from 'react-player';
import ReactCrop from 'react-image-crop';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import ChevronRight from '@material-ui/icons/ChevronRight';
import DeleteIcon from '@material-ui/icons/Delete';
import ViewsIcon from '@material-ui/icons/Visibility';
import CropIcon from '@material-ui/icons/Crop';
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto';
import Send from '@material-ui/icons/Send';
import AddPhotoAlternate from '@material-ui/icons/AddPhotoAlternate';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import userImage from '../../../assets/images/user.svg';
import { get, post, apiValidation, uploadFiles } from '../../../Utilities';
import { getUserProfile } from '../../../redux/reducers/userProfile.reducer';
import { getClientId, getClientUserId } from '../../../redux/reducers/clientUserId.reducer';
import './AppStories.scss';

const AppStories = (props) => {
  const {
    clientId,
    clientUserId,
    userProfile: { profileImage },
  } = props;
  const [statusModal, setStatusModal] = useState(false);
  const [deleteStatusModal, setDeleteStatusModal] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [story, setStory] = useState([]);
  const [statusArray, setStatusArray] = useState([]);
  const [imageModal, setImageModal] = useState(false);
  const [statusUploading, setStatusUploading] = useState(false);
  const [displayIndex, setDisplayIndex] = useState(0);
  const [xDown, setXDown] = useState(null);
  const [yDown, setYDown] = useState(null);
  const [currentRunning, setCurrentRunning] = useState(0);
  const [isCropping, setIsCropping] = useState(false);
  const [crop, setCrop] = useState({ unit: '%', width: 100, height: 100 });
  const [img, setImg] = useState(null);
  const storiesRef = useRef(null);
  const fileSelectorRef = useRef(null);

  const getCroppedImg = (image, fileName) => {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');

    // New lines to be added
    const pixelRatio = window.devicePixelRatio;
    canvas.width = crop.width * pixelRatio;
    canvas.height = crop.height * pixelRatio;
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = 'high';

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height,
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          blob.name = fileName;
          console.log(blob);
          resolve(blob);
        },
        selectedFiles[displayIndex].file.type,
        1,
      );
    });
  };

  // const story = [
  //   {
  //     url: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1547033579',
  //     duration: 3000,
  //     currentIndex: 0,
  //   },
  //   {
  //     url: 'https://s3.ap-south-1.amazonaws.com/question-images-ingenium/1642707442124.jpg',
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
    setCurrentRunning(index);
  };

  const storyEnded = (index) => {
    console.log('Story ended', index);
    console.log(storiesRef.current);
  };

  const allStoriesEnded = (index) => {
    console.log('all ended', index);
    const currentClientUser = story[0].client_user_id;
    const currentStoryIndex = statusArray.findIndex(
      (ele) => ele[0].client_user_id === currentClientUser,
    );
    if (currentStoryIndex === -1) return;
    if (currentStoryIndex === statusArray.length - 1) {
      console.log('last story');
      setStatusModal(false);
      return;
    }
    nextUserStory();
  };

  function getTouches(evt) {
    return (
      evt.touches || evt.originalEvent.touches // browser API
    ); // jQuery
  }

  const handleTouchStart = (evt) => {
    const firstTouch = getTouches(evt)[0];

    setXDown(firstTouch.clientX);
    setYDown(firstTouch.clientY);
  };

  const handleTouchMove = (evt) => {
    if (!xDown || !yDown) {
      return;
    }

    const xUp = evt.touches[0].clientX;
    const yUp = evt.touches[0].clientY;

    const xDiff = xDown - xUp;
    const yDiff = yDown - yUp;

    if (Math.abs(xDiff) > Math.abs(yDiff)) {
      /* eslint-disable */
      if (xDiff > 0) {
        console.log('right swipe');
        nextUserStory();
      } else {
        console.log('left swipe');
        prevUserStory();
      }
    } else {
      if (yDiff > 0) {
        console.log('down Swipe');
      } else {
        console.log('up swipe');
        setStatusModal(false);
      }
    }
    /* reset values */
    setXDown(null);
    setYDown(null);
  };

  const openFilePicker = (e) => {
    e.stopPropagation();
    setStatusModal(false);
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

  const rerenderStatus = () => {
    get({ client_id: clientId, client_user_id: clientUserId }, '/getAllStatusForAUser').then(
      (res) => {
        const result = apiValidation(res);
        console.log(result, 'getAllStatusForAUser');
        // const temp = [...result, ...result, ...result];
        setStatusArray(result);
      },
    );
  };

  const openClickedStory = (ele) => {
    /* eslint-disable */
    const newStory = statusArray.find((elem) => elem[0]?.client_user_id === ele[0]?.client_user_id);
    const formattedStory = newStory.map((stry, index) => {
      stry.url = stry.file_url;
      stry.duration = stry.duration || 5000;
      stry.currentIndex = index;
      stry.type = stry.file_type;
      stry.styles = { width: '100%' };
      stry.header = {
        heading: `${stry.first_name} ${stry.last_name}`,
        profileImage: stry.profile_image || userImage,
      };
      return stry;
    });
    console.log(formattedStory);
    setStory(formattedStory);
    setStatusModal(true);
  };

  const addStatusByUser = () => {
    setStatusUploading(true);
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
          sortedEle.duration = sortedEle.duration || 5000;
          sortedEle.status_text = file.status_text;
          sortedAttachmentsArray.push(sortedEle);
        }
        console.log(sortedAttachmentsArray);
        const attachments = JSON.stringify(formatAttachments(sortedAttachmentsArray));
        payload.file_array = attachments;
        post(payload, '/addStatus').then((res) => {
          console.log(res);
          setStatusModal(false);
          setImageModal(false);
          setSelectedFiles([]);
          setStatusUploading(false);
          rerenderStatus();
        });
      });
    }
  };

  const deleteStatus = () => {
    const payload = {
      status_id: statusArray[0][currentRunning].status_id,
      client_user_id: clientUserId,
    };
    post(payload, '/deleteStatus').then((res) => {
      console.log(res);
      setStatusModal(false);
      setDeleteStatusModal(false);
      rerenderStatus();
    });
    console.log(payload);
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
      status_text: '',
    });
    setSelectedFiles(files);
    setImageModal(true);
    if (selectedFiles.length > 0) setDisplayIndex(files.length - 1);
  };

  const removeFileFromSelectedFiles = () => {
    console.log(selectedFiles);
    const newSelectedFiles = selectedFiles.filter((elem, index) => index !== displayIndex);
    setSelectedFiles(newSelectedFiles);
    if (selectedFiles.length === 1) setImageModal(false);
    if (displayIndex === 0) {
      console.log('kuch nahi');
    } else {
      decrementDisplayIndex();
    }
  };

  const closeModal = () => setStatusModal(false);
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

  const nextUserStory = () => {
    setStatusModal(false);
    const currentClientUser = story[0].client_user_id;
    const currentStoryIndex = statusArray.findIndex(
      (ele) => ele[0].client_user_id === currentClientUser,
    );
    console.log(currentStoryIndex);
    if (currentStoryIndex === -1) return;
    if (currentStoryIndex === statusArray.length - 1) {
      console.log('last story');
      return;
    }
    const newStory = statusArray.find((ele, index) => index === currentStoryIndex + 1);
    const formattedStory = newStory.map((stry, index) => {
      stry.url = stry.file_url;
      stry.duration = stry.duration || 5000;
      stry.currentIndex = index;
      stry.type = stry.file_type;
      stry.styles = { width: '100%' };
      stry.header = {
        heading: `${stry.first_name} ${stry.last_name}`,
        profileImage: stry.profile_image || userImage,
      };
      return stry;
    });
    setTimeout(() => {
      setStory(formattedStory);
      setStatusModal(true);
    }, 200);
  };

  const prevUserStory = () => {
    setStatusModal(false);
    const currentClientUser = story[0].client_user_id;
    const currentStoryIndex = statusArray.findIndex(
      (ele) => ele[0].client_user_id === currentClientUser,
    );

    console.log(currentStoryIndex);
    if (currentStoryIndex === -1) return;
    if (currentStoryIndex === 0) {
      console.log('first story');
      return;
    }
    const newStory = statusArray[currentStoryIndex - 1];
    const formattedStory = newStory.map((stry, index) => {
      stry.url = stry.file_url;
      stry.duration = stry.duration || 5000;
      stry.currentIndex = index;
      stry.type = stry.file_type;
      stry.styles = { width: '100%' };
      stry.header = {
        heading: `${stry.first_name} ${stry.last_name}`,
        profileImage: stry.profile_image || userImage,
      };
      return stry;
    });
    setTimeout(() => {
      setStory(formattedStory);
      setStatusModal(true);
    }, 200);
  };

  const deleteProcessHandler = () => {
    setDeleteStatusModal(true);
    setStatusModal(false);
  };

  const onImageLoaded = (image) => {
    setImg(image);
  };

  const changeCropHandler = (newCrop) => {
    setCrop(newCrop);
    console.log(newCrop);
  };

  const setCroppedImage = async () => {
    const fileName = selectedFiles[displayIndex].file.name;
    const blob = await getCroppedImg(img, fileName);
    const finalFile = new File([blob], fileName, { type: blob.type });
    let fileType = 'image';
    if (finalFile.type.includes('video')) {
      fileType = 'video';
    }
    const newSelectedFiles = [...selectedFiles];
    newSelectedFiles[displayIndex] = {
      file: finalFile,
      type: fileType,
      path: URL.createObjectURL(finalFile),
    };
    setSelectedFiles(newSelectedFiles);
    setIsCropping(false);
  };

  const updateStatusText = (e) => {
    const newSelectedFiles = [...selectedFiles];
    newSelectedFiles[displayIndex].status_text = e.target.value;
    setSelectedFiles(newSelectedFiles);
  };

  return (
    <>
      {statusUploading && (
        <div className='addStatusBackdrop'>
          <Spinner animation='border' role='status'>
            <span className='d-none'>Loading...</span>
          </Spinner>
        </div>
      )}
      <Modal
        show={imageModal}
        onHide={handleClose}
        style={{ height: '100vh' }}
        className='d-flex justify-content-center filesModal widthControl'
      >
        <Modal.Header className='modalHeader' closeButton>
          <div className='d-flex justify-content-between w-100'>
            <p className='modalText'>Crop Image</p>
            <div className='d-flex'>
              <CropIcon className='mr-2' onClick={() => setIsCropping((prev) => !prev)} />
              <DeleteIcon
                style={isCropping ? { color: 'gray' } : {}}
                onClick={isCropping ? () => {} : removeFileFromSelectedFiles}
              />
            </div>
          </div>
        </Modal.Header>
        <Modal.Body
          style={{ width: `${selectedFiles.length * 100}%` }}
          className='imageModalFiles modalDivStories'
        >
          {!isCropping && (
            <div className='selectedImagesMapContainer'>
              {selectedFiles.map((ele) => {
                return (
                  <div
                    style={{ transform: `translateX(-${displayIndex * 100}%)` }}
                    className='modalImageStories'
                  >
                    {ele.type === 'video' ? (
                      <ReactPlayer
                        className=''
                        controls
                        url={[{ src: ele.path, type: 'video/mp4' }]}
                        width='100%'
                        // height='280px'
                      />
                    ) : (
                      <img className='modalSelectedImages' src={ele.path} />
                    )}
                  </div>
                );
              })}
            </div>
          )}
          {isCropping && (
            <div className='cropContainer'>
              <ReactCrop
                className='d-flex blacker w-100'
                src={selectedFiles[displayIndex]?.path}
                crop={crop}
                onChange={(newCrop) => changeCropHandler(newCrop)}
                onImageLoaded={onImageLoaded}
                style={{ width: '100%', backgroundColor: 'black' }}
                imageStyle={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: '70vh',
                  maxWidth: '90vw',
                }}
              />
            </div>
          )}
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
          {!isCropping && (
            <>
              <div className='addCaptionContainer'>
                <button
                  className='btnAddMorePhoto'
                  type='button'
                  onClick={(e) => openFilePicker(e)}
                >
                  <AddPhotoAlternate className='addMorePhoto' />
                </button>
                <input
                  type='text'
                  className='addCaptionContainerInput'
                  placeholder='add caption'
                  value={selectedFiles[displayIndex]?.status_text}
                  onChange={(e) => updateStatusText(e)}
                />
              </div>
              <button type='button' className='addStatusButton' onClick={() => addStatusByUser()}>
                <Send />
              </button>
            </>
          )}
          {isCropping && <Button onClick={setCroppedImage}>CROP</Button>}
        </Modal.Footer>
      </Modal>
      <div className='scrollableStatuses'>
        <input type='file' className='d-none' ref={fileSelectorRef} onChange={(e) => saveFiles()} />
        {statusArray.map((ele, index) => {
          let statusCircleDynamicClass = 'statusCircle';
          if (index === 0 && !ele[0]?.file_url) {
            statusCircleDynamicClass = 'statusCircle grayStatusCircle';
          }
          return (
            /* eslint-disable */
            <div className='mx-1'>
              <div
                onClick={(e) => (ele[0].file_url ? openClickedStory(ele) : openFilePicker(e))}
                key={ele[0]?.client_user_id}
                className={index === 0 ? statusCircleDynamicClass : 'statusCircle'}
                // className='statusCircle'
              >
                <img className='statusProfileImage' src={ele[0]?.profile_image || userImage} />
              </div>
              {index === 0 && (
                <div className='plusMarkContainer'>
                  <p className='plusMarkStories'>+</p>
                </div>
              )}
              <p className='statusUserName'>{`${ele[0]?.first_name}`}</p>
            </div>
          );
        })}
      </div>
      {statusModal && (
        <div className='d-flex NextAndPrevArrows'>
          <button onClick={prevUserStory} type='button' className='buttonNone'>
            <ChevronLeft />
          </button>
          <button onClick={nextUserStory} type='button' className='buttonNone'>
            <ChevronRight />
          </button>
        </div>
      )}
      <Modal
        show={statusModal}
        // show={true}
        onHide={() => setStatusModal(false)}
        centered
        // animation={false}
        style={{ height: '100vh' }}
        className='d-flex justify-content-center widthControl'
      >
        <Modal.Header
          className='mb-0 modalHeadStories modalHeader py-0'
          style={{ border: 'transparent' }}
          closeButton
        />

        <Modal.Body
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          fullscreen
          className='modalDivStories'
        >
          <Stories
            width='100%'
            height='100%'
            stories={story}
            // ref={storiesRef}
            isPaused={false}
            // loop
            onStoryStart={storyStart}
            onStoryEnd={storyEnded}
            onAllStoriesEnd={allStoriesEnded}
            keyboardNavigation
            storyStyles={{ justifyContent: 'center', width: '100%' }}
          />
          {story[currentRunning]?.status_text && (
            <p className='caption'>{story[currentRunning].status_text}</p>
          )}
        </Modal.Body>
        <Modal.Footer className='statusViewFooter'>
          {story[0]?.client_user_id === clientUserId && (
            <>
              <p className='views'>
                <ViewsIcon className='mr-2' />
                {story[currentRunning]?.no_of_views}
              </p>
              <div>
                <AddAPhotoIcon className='mr-2' onClick={openFilePicker} />
                <DeleteIcon onClick={deleteProcessHandler} />
              </div>
            </>
          )}
        </Modal.Footer>
      </Modal>
      <Modal show={deleteStatusModal} onHide={() => setDeleteStatusModal(false)} centered>
        <Modal.Header closeButton>
          <p className='modalText'>Are you sure you want to delete this story?</p>
        </Modal.Header>
        <Modal.Body className='text-center'>
          {story.length && (
            <div>
              {story[currentRunning]?.type === 'video' ? (
                <ReactPlayer
                  className='video-message'
                  controls
                  url={[{ src: story[currentRunning]?.url, type: 'video/mp4' }]}
                  width='100%'
                  // height='280px'
                />
              ) : (
                <img
                  src={story[currentRunning]?.url}
                  alt='current story'
                  className='deleteModalImage'
                />
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setDeleteStatusModal(false)} variant='boldTextSecondary'>
            Cancel
          </Button>
          <Button onClick={deleteStatus} variant='boldText'>
            Delete
          </Button>
        </Modal.Footer>
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
