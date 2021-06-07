import React, { useState, useRef, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import ReactCrop from 'react-image-crop';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import 'react-image-crop/dist/ReactCrop.css';
import { uploadImage } from '../../../Utilities';

const generateImageURL = (canvas, crop) => {
  if (!crop || !canvas) {
    return '';
  }

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      const newFileName = `${Math.random().toString(16).slice(2)}.png`;
      const finalFile = new File([blob], newFileName);

      uploadImage(finalFile).then((res) => {
        console.log('fileu;lod ', res);
        resolve(res.filename);
      });
    });
  });
};

export const Cropper = (props) => {
  const { imageModal, handleClose, setProfileImage, sourceImage, aspectTop, aspectBottom } = props;

  const imgRef = useRef(null);
  const previewCanvasRef = useRef(null);
  const [crop, setCrop] = useState({ unit: '%', width: 30, aspect: aspectTop / aspectBottom });
  const [completedCrop, setCompletedCrop] = useState(null);

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

  const uploadProfileImage = async () => {
    console.log(previewCanvasRef.current);
    generateImageURL(previewCanvasRef.current, completedCrop).then((res) => {
      console.log(res, 'resp');
      setProfileImage(res);
    });

    handleClose();
  };

  return (
    <Modal show={imageModal} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Crop Image</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row className='mx-2 justify-content-between'>
          <Col xs={12}>
            <ReactCrop
              src={sourceImage}
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
  );
};

Cropper.propTypes = {
  imageModal: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  setProfileImage: PropTypes.func.isRequired,
  sourceImage: PropTypes.string.isRequired,
  aspectTop: PropTypes.number.isRequired,
  aspectBottom: PropTypes.number.isRequired,
};
