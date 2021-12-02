import React, { useState, useRef } from 'react';
import Button from 'react-bootstrap/Button';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ReactCrop from 'react-image-crop';
import Cropper from '../../Common/CropperModal/Cropper';
import { PageHeader } from '../../Common/PageHeader/PageHeader';
import { uploadFiles } from '../../../Utilities';
import { getConversation, getSocket } from '../../../redux/reducers/conversations.reducer';
import { getClientUserId } from '../../../redux/reducers/clientUserId.reducer';
import 'react-image-crop/dist/ReactCrop.css';
import './ImageEditor.scss';

const ImageEditor = ({}) => {
  const history = useHistory();
  const conversation = useSelector((state) => getConversation(state));
  const clientUserId = useSelector((state) => getClientUserId(state));
  const socket = useSelector((state) => getSocket(state));
  const [img, setImg] = useState(null);
  const [crop, setCrop] = useState({ unit: '%', width: 100, height: 100 });
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

    // const img = document.createElement('img')
    // img.src = canvas.toDataURL()
    // return img

    // As a blob
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          blob.name = fileName;
          console.log(blob);
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
      const emitData = {
        sender_id: clientUserId,
        conversation_id: conversation.id,
        text: '',
        type: 'message',
        attachments_array: [{ url: filename, type: 'image', name: state.file.name }],
      };
      socket?.emit('sendMessage', emitData, (error, data) => {
        console.log('ack', data);
        history.replace('/conversation');
      });
    });
  };

  const onImageLoaded = (image) => {
    setImg(image);
  };

  const changeCropHandler = (newCrop) => {
    setCrop(newCrop);
    console.log(newCrop);
  };

  return (
    <div className='imageEditorContainer'>
      <PageHeader title='Preview Image' />
      <ReactCrop
        className='mb-4 d-flex justify-content-center'
        src={state.message.content}
        crop={crop}
        onChange={(newCrop) => changeCropHandler(newCrop)}
        onImageLoaded={onImageLoaded}
        imageStyle={{
          width: '100%',
          height: 'auto',
          maxHeight: '70vh',
          maxWidth: '90vw',
        }}
      />
      <Button className='btn-block picsendbtn' onClick={sendCroppedImage}>
        SEND
      </Button>
    </div>
  );
};

export default ImageEditor;
