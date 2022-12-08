import React, { useState, useRef, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import ReactCrop from 'react-image-crop';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import 'react-image-crop/dist/ReactCrop.css';
import { uploadingImage } from '../../../Utilities/customUpload';
// import { uploadImage } from '../../../Utilities';
// import { uploadingImage } from '../../../Utilities/customUpload';

const Cropper = (props) => {
  const {
    imageModal,
    handleClose,
    setProfileImage,
    sourceImage,
    aspectTop,
    aspectBottom,
    fromDisplayPage,
    getCardUrl,
    clientId,
    featureId,
    feature,
  } = props;

  const imgRef = useRef(null);
  const previewCanvasRef = useRef(null);
  const [crop, setCrop] = useState({ unit: '%', width: 30, aspect: aspectTop / aspectBottom });
  const [completedCrop, setCompletedCrop] = useState(null);
  const [cardUrl, setCardUrl] = useState('');

  const callCardUrl = (url) => {
    getCardUrl(url);
  };

  const onLoad = useCallback((img) => {
    imgRef.current = img;
  }, []);

  const generateImageURL = (canvas, cropp) => {
    if (!cropp || !canvas) {
      return '';
    }

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        const newFileName = `${Math.random().toString(16).slice(2)}.png`;
        const finalFile = new File([blob], newFileName);
        console.log(finalFile, 'finalfile');
        console.log(featureId, 'cuid'); // clientUserId is actually feature_id
        let path = '';
        if (!featureId) {
          path = `${
            process.env.NODE_ENV == 'development' ? 'Development' : 'Production'
          }/${clientId}/${feature}/Images`;
        } else {
          path = `${
            process.env.NODE_ENV == 'development' ? 'Development' : 'Production'
          }/${clientId}/${feature}/${featureId}/Images`;
        }
        let customName = '';
        if (feature === 'Profile') {
          customName = 'profile';
          path = `${
            process.env.NODE_ENV == 'development' ? 'Development' : 'Production'
          }/${clientId}/${feature}/${featureId}/Images`;
        }

        console.log(path, 'finalPath');
        uploadingImage(finalFile, path, customName).then((res) => {
          console.log('fileu;lod', res);
          resolve(res.filename);
        });
      });
    });
  };

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

  const uploadProfileImage = async () => {
    console.log(previewCanvasRef.current);
    generateImageURL(previewCanvasRef.current, completedCrop).then((res) => {
      console.log(res, 'resp');
      setProfileImage(res);
    });

    handleClose();
  };

  return (
    <Modal show={imageModal} onHide={handleClose} backdrop='static' centered>
      <Modal.Header closeButton>
        <Modal.Title>Crop Image</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ flexDirection: 'column' }} className='d-flex justify-content-center'>
        <Row className='mx-2 justify-content-between'>
          <Col xs={12}>
            <ReactCrop
              src={sourceImage}
              onImageLoaded={onLoad}
              crop={crop}
              onChange={(c) => {
                const cropp = {
                  ...c,
                  // aspect: sourceImage.width / sourceImage.height,
                };
                setCrop(cropp);
              }}
              onComplete={(c) => setCompletedCrop(c)}
            />
          </Col>
          <Col xs={12} style={{ display: 'none' }}>
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
        {fromDisplayPage ? (
          <Row className='px-4'>
            <p className='scheduleCardSmallText my-1 mx-0'>Add redirect url (optional)</p>
            <label style={{ width: '100%' }} htmlFor='url' className='d-flex has-float-label'>
              <input
                className='form-control'
                name='url'
                type='text'
                placeholder='Enter url'
                onChange={(e) => {
                  setCardUrl(e.target.value);
                  callCardUrl(e.target.value);
                }}
                value={cardUrl}
              />
              <span
                role='button'
                tabIndex={-1}
                onKeyDown={(e) => e.target.previousSibling.focus()}
                onClick={(e) => e.target.previousSibling.focus()}
              >
                Enter url
              </span>
            </label>
          </Row>
        ) : null}
      </Modal.Body>
      <Modal.Footer>
        <Button variant='boldTextSecondary' onClick={() => handleClose()}>
          Cancel
        </Button>
        <Button variant='boldText' onClick={() => uploadProfileImage()}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

Cropper.propTypes = {
  imageModal: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  setProfileImage: PropTypes.func.isRequired,
  sourceImage: PropTypes.string.isRequired,
  aspectTop: PropTypes.number.isRequired,
  aspectBottom: PropTypes.number.isRequired,
  fromDisplayPage: PropTypes.bool,
  getCardUrl: PropTypes.func,
  clientId: PropTypes.number,
  featureId: PropTypes.number,
  feature: PropTypes.string,
};

Cropper.defaultProps = {
  fromDisplayPage: false,
  getCardUrl: () => {},
  clientId: '',
  featureId: '',
  feature: '',
};

export default Cropper;
