import AWS from 'aws-sdk';
import { loadingActions } from '../redux/actions/loading.action';
import store from '../redux/store';
import { get } from './Remote';
import { apiValidation } from './utilities';

export const uploadingImage = (file) => {
  console.log(file);

  return new Promise((resolve, rej) => {
    get(null, '/getAwsCredentialsWithBucketConfiguration').then((res) => {
      const result = apiValidation(res);
      AWS.config.update({
        accessKeyId: result.key,
        secretAccessKey: result.secret,
        region: result.region,
      });

      const bucket = new AWS.S3({
        params: {
          Bucket: result.bucket_name,
        },
      });
      const params = { Key: file.name, ContentType: file.type, Body: file };
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
  console.log(url);
  get({ url }, '/getBucketAndPath').then((res) => {
    const result = apiValidation(res);
    AWS.config.update({
      accessKeyId: result.key,
      secretAccessKey: result.secret,
      region: result.region,
    });

    const urlArray = url.split('/');
    const key = urlArray.slice(3).join('/');
    console.log(key);
    const s3 = new AWS.S3({ params: { Bucket: result.bucket } });
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

export const uploadMultipleImages = async (fileArray) => {
  console.log(fileArray);
  const arr = [];
  for (let i = 0; i < fileArray.length; i++) {
    arr.push(uploadingImage(fileArray[i]));
  }

  const result = await Promise.all(arr);
  return result.map((e, i) => {
    const obj = {};
    obj.name = fileArray[i].name;
    obj.filename = e.filename;
    return obj;
  });
};
