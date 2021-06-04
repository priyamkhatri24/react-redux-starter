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
