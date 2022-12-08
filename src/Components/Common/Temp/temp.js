import React, { useEffect, useState } from 'react';
import PlyrComponent from 'plyr-react';
import AWS from 'aws-sdk';
import { get } from '../../../Utilities';

import 'plyr-react/dist/plyr.css';
// import ReactPlayer from 'react-player';

const Temp = () => {
  const [imageUrl, setImageUrl] = useState('');

  // useEffect(() => {
  //   const xhr = new XMLHttpRequest();

  //   xhr.open(
  //     'GET',
  //     // 'http://vjs.zencdn.net/v/oceans.mp4',
  //   );
  //   xhr.responseType = 'arraybuffer';

  //   xhr.onload = function (e) {
  //     const blob = new Blob([xhr.response]);
  //     const url = URL.createObjectURL(blob);
  //     console.log(url);
  //     setImageUrl(url);
  //     const img = document.getElementById('sapad');
  //     img.src = url;
  //   };
  //   xhr.send();
  // }, []);

  // useEffect(() => {
  //   const xhr = new XMLHttpRequest();

  //   xhr.open(
  //     'GET',
  //     // prettier-ignore
  //     `https://s3.ap-south-1.amazonaws.com/question-images-ingenium/1622643251264.mp4`,
  //     // 'http://vjs.zencdn.net/v/oceans.mp4',
  //   );
  //   xhr.responseType = 'arraybuffer';

  //   xhr.onload = function (e) {
  //     const blob = new Blob([xhr.response]);
  //     const url = URL.createObjectURL(blob);
  //     console.log(url);
  //     setImageUrl(url);
  //     const img = document.getElementById('sapad2');
  //     img.src = url;
  //   };
  //   xhr.send();
  // }, []);

  // function createObjectURL(object) {
  //   return window.URL
  //     ? window.URL.createObjectURL(object)
  //     : window.webkitURL.createObjectURL(object);
  // }

  // async function display(videoStream) {
  //   const video = document.getElementById('sapad');
  //   const blob = await fetch(videoStream).then((r) => r.blob());
  //   const videoUrl = createObjectURL(blob);
  //   console.log(videoUrl);
  //   video.src = videoUrl;
  // }

  useEffect(() => {
    get(null, '/getAwsCredentialsWithBucketConfiguration').then((res) => {
      console.log(res);
    });

    AWS.config.update({
      accessKeyId: 'AKIAXIWOK44ITYEOJK2M',
      secretAccessKey: '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',
    });
    const params = {
      Bucket: 'question-images-ingenium',
      Key: '1622643251264.mp4',
      Expires: 10,
    };
    // const S3 = new AWS.S3();
    const S3 = new AWS.S3({ region: 'ap-south-1', signatureVersion: 'v4' });
    const url = S3.getSignedUrl('getObject', params);
    console.log('The URL is', url);
  }, []);

  const options = {
    autoplay: true,
    youtube: { noCookie: false, rel: 0, showinfo: 0, iv_load_policy: 3, modestbranding: 1 },
  };
  return (
    <div className='lol'>
      <PlyrComponent
        source={{
          type: 'video',
          sources: [
            {
              src: 'https://s3.ap-south-1.amazonaws.com/question-images-ingenium/1622643251264.mp4',
            },
          ],
        }}
        options={options}
      />
    </div>
  );
};

export default Temp;

// https://userfiles-ingenium.s3.ap-south-1.amazonaws.com/SampleVideo_1280x720_1mb.mp4
// https://s3.ap-south-1.amazonaws.com/userfiles-ingenium/SampleVideo_1280x720_1mb.mp4
// https://userfiles-ingenium.s3.ap-south-1.amazonaws.com/Development/3.01606.020210303_205655.mp4
