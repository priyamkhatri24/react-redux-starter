import S3 from 'aws-sdk/clients/s3';
import { v4 as uuidv4 } from 'uuid';
// import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { loadingActions } from '../redux/actions/loading.action';
import store from '../redux/store';
import { get } from './Remote';
import { apiValidation } from './utilities';

export const uploadingImage = (file, path = null, customName = null) => {
  console.log(file);
  const { name } = file;
  let extention = name.split('.').pop();
  if (extention.length > 4) {
    extention = 'others';
  }
  const newName = name.split('.')[0] + Date.now();
  let finalName = `${uuidv4()}.${name.split('.').pop()}`;
  if (customName == 'sa') {
    finalName = customName;
    extention = '';
  }
  return new Promise((resolve, rej) => {
    get(null, '/getAwsCredentialsWithBucketConfiguration').then((res) => {
      const result = apiValidation(res);
      // S3.config.update({
      //   accessKeyId: result.key,
      //   secretAccessKey: result.secret,
      //   region: result.region,
      // });
      let bucketname = 'ingenium-bucket-cloudfront';
      if (path) {
        bucketname = `ingenium-bucket-cloudfront/${path}`;
      }

      const bucket = new S3({
        params: {
          Bucket: extention
            ? `${result.bucket_name}/${path}/${extention}`
            : `${result.bucket_name}/${path}`,
        },
        accessKeyId: result.key,
        secretAccessKey: result.secret,
        region: result.region,
      });
      console.log(bucket, 'bwahaha');
      const params = { Key: finalName, ContentType: file.type, Body: file };
      // console.log(params, 'file uploaaaaaaaaaaaaaaaaad');
      store.dispatch(loadingActions.pending());
      bucket
        .upload(params)
        .on('httpUploadProgress', (evt) => {
          store.dispatch(
            loadingActions.setAmountLoadedToStore(Math.floor((evt.loaded * 100) / evt.total)),
          );
          // store.dispatch(loadingActions.setTotalLoadedToStore(100));
          //     console.log('Progress:', evt.loaded, '/', evt.total);
        })
        .send((err, data) => {
          console.log(err, data);
          const obj = {};
          obj.filename = data.Location;
          store.dispatch(loadingActions.success());
          resolve(obj);
        });
    });
  });
};

export const downloadFile = (url) => {
  get({ url }, '/getBucketAndPath').then((res) => {
    const result = apiValidation(res);
    // AWS.config.update({
    //   accessKeyId: result.key,
    //   secretAccessKey: result.secret,
    //   region: result.region,
    // });

    const urlArray = url.split('/');
    const key = urlArray.slice(3).join('/');
    console.log(key);
    const s3 = new S3({
      params: { Bucket: result.bucket },
      accessKeyId: result.key,
      secretAccessKey: result.secret,
      region: result.region,
    });
    const params = { Bucket: result.bucket, Key: key };
    s3.getObject(params, (err, data) => {
      console.log(err);
      console.log(data);
      const blob = new Blob([data.Body], { type: data.ContentType });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = url;
      link.click();
    });
  });
};

export const deleteFileFromS3 = (url) => {
  // console.log(url, 'hooo delete hora');
  // // prettier-ignore
  // const urla =
  // get({ url: urla }, '/getBucketAndPath').then((res) => {
  //   const result = apiValidation(res);
  //   const s3 = new S3({
  //     params: { Bucket: result.bucket },
  //     accessKeyId: result.key,
  //     secretAccessKey: result.secret,
  //     region: result.region,
  //   });
  //   // const urlArray = url.split('/');
  //   // const key = urlArray.slice(3).join('/');
  //   const key = urla.split('.net/')[1];
  //   const params = { Bucket: result.bucket, Key: key };
  //   console.log(params, 'params for delete');
  //   s3.deleteObject(params, (err, data) => {
  //     if (err) console.log(err);
  //     if (data) console.log(data);
  //   });
  // });
};

export const uploadMultipleImages = async (fileArray, path = null, feature) => {
  console.log(fileArray, 'CU');
  const arr = [];
  for (let i = 0; i < fileArray.length; i++) {
    if (path) {
      if (feature == 'courses') {
        const imagesOrVideos = fileArray[i].type.includes('image')
          ? 'Images'
          : fileArray[i].type.includes('video')
          ? 'Videos'
          : 'Files';
        arr.push(uploadingImage(fileArray[i], `${path}/${imagesOrVideos}`));
      } else {
        arr.push(uploadingImage(fileArray[i], path));
      }
    } else {
      arr.push(uploadingImage(fileArray[i]));
    }
  }

  const result = await Promise.all(arr);
  return result.map((e, i) => {
    const obj = {};
    obj.name = fileArray[i].name;
    obj.filename = e.filename;
    /* eslint-disable */
    obj.type = fileArray[i].type.split('/')[0];
    return obj;
  });
};
