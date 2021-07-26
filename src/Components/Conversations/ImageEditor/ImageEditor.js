import React, { useState, useRef } from 'react';
import Button from 'react-bootstrap/Button';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ReactCrop from 'react-image-crop';
import { get, apiValidation, uploadFiles, post } from '../../../Utilities';
import {
  getConversation,
  getSocket,
  getPosts,
} from '../../../redux/reducers/conversations.reducer';
import { getClientUserId } from '../../../redux/reducers/clientUserId.reducer';

import 'react-image-crop/dist/ReactCrop.css';

const ImageEditor = ({}) => {
  const history = useHistory();
  const conversation = useSelector((state) => getConversation(state));
  const clientUserId = useSelector((state) => getClientUserId(state));
  const socket = useSelector((state) => getSocket(state));
  const [img, setImg] = useState(null);
  const [crop, setCrop] = useState({});
  const {
    location: { state },
  } = history;

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

    // As a blob
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          blob.name = fileName;
          resolve(blob);
        },
        state.file.type,
        1,
      );
    });
  };

  const sendCroppedImage = async () => {
    const blob = await getCroppedImg(img, state.file.name);
    uploadFiles([{ file: blob, type: state.file.type }]).then((res) => {
      console.log('res', res);
      const { attachments_array: arr } = res;
      const { url: filename } = arr[0];
      socket.emit(
        'sendMessage',
        {
          sender_id: clientUserId,
          conversation_id: conversation.id,
          text: null,
          type: 'message',
          attachments_array: [{ url: filename, type: 'image', name: state.file.name }],
        },
        (error, data) => {
          console.log('ack', data);
          history.push('/conversation');
        },
      );
    });
  };

  const onImageLoaded = (image) => {
    setImg(image);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100vh',
      }}
    >
      <ReactCrop
        src={state.message.content}
        crop={crop}
        onChange={(newCrop) => setCrop(newCrop)}
        onImageLoaded={onImageLoaded}
        imageStyle={{ width: '100%' }}
      />
      <Button className='btn-block' onClick={sendCroppedImage}>
        SEND
      </Button>
    </div>
  );
};

export default ImageEditor;
