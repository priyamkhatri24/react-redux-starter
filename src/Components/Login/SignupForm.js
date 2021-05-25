import React, { useState, useRef, useCallback, useEffect } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
import Button from 'react-bootstrap/Button';
import ReactCrop from 'react-image-crop';
import Modal from 'react-bootstrap/Modal';
import 'react-image-crop/dist/ReactCrop.css';
import Signup from '../../assets/images/Login/ProfilePic.svg';
import './Login.scss';
import { uploadImage } from '../../Utilities';

function generateImageURL(canvas, crop) {
  if (!crop || !canvas) {
    return;
  }

  canvas.toBlob((blob) => {
    const finalFile = new File([blob], 'image.png');

    uploadImage(finalFile).then((res) => {
      console.log('fileu;lod ', res);
    });
  });
}

const SignupForm = () => {
  const [details, setDetails] = useState({ first_name: '', last_name: '', email: '' });
  const profileImageRef = useRef(null);
  const [upImg, setUpImg] = useState();
  const imgRef = useRef(null);
  const previewCanvasRef = useRef(null);
  const [crop, setCrop] = useState({ unit: '%', width: 30, aspect: 16 / 9 });
  const [completedCrop, setCompletedCrop] = useState(null);
  const [imageModal, setImageModal] = useState(false);

  const handleClose = () => setImageModal(false);
  const handleOpen = () => setImageModal(true);

  const onSelectFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => setUpImg(reader.result));
      reader.readAsDataURL(e.target.files[0]);
      handleOpen();
    }
  };

  const onLoad = useCallback((img) => {
    imgRef.current = img;
  }, []);

  useEffect(() => {
    if (!completedCrop || !previewCanvasRef.current || !imgRef.current) {
      return;
    }

    const image = imgRef.current;
    const canvas = previewCanvasRef.current;
    // eslint-disable-next-line
    const crop = completedCrop;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext('2d');
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
  }, [completedCrop]);

  const uploadProfileImage = () => {
    console.log(previewCanvasRef.current);
    generateImageURL(previewCanvasRef.current, completedCrop);
  };

  return (
    <>
      <Row className='mx-2 mt-4'>
        <Col xs={7} className='align-self-end Login__signupHeading'>
          Help us know you better :)
        </Col>
        <Col xs={5}>
          <img src={Signup} alt='login person' width='120px' height='125px' />
        </Col>
      </Row>
      <div
        className='Login__photoPlaceHolder mt-4 ml-4'
        onClick={() => profileImageRef.current.click()}
        onKeyDown={() => profileImageRef.current.click()}
        tabIndex='-1'
        role='button'
      >
        Add Photo
        <span className='Login__camera'>
          <PhotoCameraIcon />
        </span>
        <input
          type='file'
          name='upload-photo'
          id='upload-photo'
          onChange={onSelectFile}
          style={{ display: 'none' }}
          ref={profileImageRef}
        />
      </div>
      <small
        className='ml-4'
        style={{
          fontSize: '10px',
          lineHeight: '13px',
          color: 'rgba(0, 0, 0, 0.87)',
          fontFamily: 'Montserrat-Light',
        }}
      >
        Profile picture (optional)
      </small>

      <div className='mx-3 mt-5 pb-4'>
        <label className='has-float-label my-auto'>
          <input
            className='form-control'
            name='First Name'
            type='text'
            placeholder='First Name'
            value={details.first_name}
            onChange={(e) => {
              const newObject = {
                ...details,
                first_name: e.target.value,
              };
              setDetails(newObject);
            }}
          />
          <span>First Name</span>
        </label>

        <label className='has-float-label my-auto'>
          <input
            className='form-control mt-3'
            name='Last Name'
            type='text'
            placeholder='Last Name'
            value={details.last_name}
            onChange={(e) => {
              const newObject = {
                ...details,
                last_name: e.target.value,
              };
              setDetails(newObject);
            }}
          />
          <span>Last Name</span>
        </label>

        <label className='has-float-label my-auto'>
          <input
            className='form-control mt-3'
            name='Email address(optional)'
            type='text'
            placeholder='Email address(optional)'
            value={details.email}
            onChange={(e) => {
              const newObject = {
                ...details,
                email: e.target.value,
              };
              setDetails(newObject);
            }}
          />
          <span>Email address(optional)</span>
        </label>
        <Button variant='loginPrimary' className='mt-5'>
          Send OTP
        </Button>
      </div>
      <Modal show={imageModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Crop Image</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className='mx-2 justify-content-between'>
            <Col xs={12}>
              <ReactCrop
                src={upImg}
                onImageLoaded={onLoad}
                crop={crop}
                onChange={(c) => setCrop(c)}
                onComplete={(c) => setCompletedCrop(c)}
              />
            </Col>
            <Col xs={12}>
              <h3>Preview</h3>
              <div>
                <canvas
                  ref={previewCanvasRef}
                  // Rounding is important so the canvas width and height matches/is a multiple for sharpness.
                  style={{
                    width: Math.round(completedCrop?.width ?? 0),
                    height: Math.round(completedCrop?.height ?? 0),
                  }}
                />
              </div>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='boldTextSecondary' onClick={() => handleClose()}>
            Cancel
          </Button>
          <Button variant='boldText' onClick={() => uploadProfileImage()}>
            Ok
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default SignupForm;
