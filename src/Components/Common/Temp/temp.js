import React, { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';

const Temp = () => {
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    const xhr = new XMLHttpRequest();

    xhr.open(
      'GET',
      // 'http://vjs.zencdn.net/v/oceans.mp4',
    );
    xhr.responseType = 'arraybuffer';

    xhr.onload = function (e) {
      const blob = new Blob([xhr.response]);
      const url = URL.createObjectURL(blob);
      console.log(url);
      setImageUrl(url);
      const img = document.getElementById('sapad');
      img.src = url;
    };
    xhr.send();
  }, []);

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

  // useEffect(() => {
  //   display('http://vjs.zencdn.net/v/oceans.mp4');
  // }, []);

  return (
    <div className='lol'>
      <h1>TEMP</h1>
      {/* <video id='sapad' style={{ maxWidth: '500px' }} /> */}
      <video className='mb-2' id='sapad' width='320' height='240' controls>
        <track src='' kind='captions' srcLang='en' label='english_captions' />
      </video>
      <video id='sapad2' width='320' height='240' controls>
        <track src='' kind='captions' srcLang='en' label='english_captions' />
      </video>
    </div>
  );
};

export default Temp;
