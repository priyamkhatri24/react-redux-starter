import S3 from 'aws-sdk/clients/s3';

import { loadingActions } from '../redux/actions/loading.action';
import store from '../redux/store';
import { get } from './Remote';
import { apiValidation } from './utilities';

export const uploadingImage = (file) => {
  console.log(file);
  const { name } = file;
  const newName = name.split('.')[0] + Date.now();
  const finalName = `${newName}.${name.split('.').pop()}`;
  return new Promise((resolve, rej) => {
    get(null, '/getAwsCredentialsWithBucketConfiguration').then((res) => {
      const result = apiValidation(res);
      // S3.config.update({
      //   accessKeyId: result.key,
      //   secretAccessKey: result.secret,
      //   region: result.region,
      // });

      const bucket = new S3({
        params: {
          Bucket: result.bucket_name,
        },
        accessKeyId: result.key,
        secretAccessKey: result.secret,
        region: result.region,
      });
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
  console.log(url);
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

export const uploadMultipleImages = async (fileArray) => {
  console.log(fileArray, 'CU');
  const arr = [];
  for (let i = 0; i < fileArray.length; i++) {
    arr.push(uploadingImage(fileArray[i]));
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
