import axios from 'axios';
import S3 from 'aws-sdk/clients/s3';
import { history } from '../Routing/History';
import { apiValidation } from './utilities';
// import { loadingActions } from '../redux/actions/loading.action';

function authHeaderPost() {
  // return authorization header with jwt token
  const { token } = JSON.parse(localStorage.getItem('state')).userProfile;

  if (token) {
    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    };
  }
  return { 'Content-Type': 'application/x-www-form-urlencoded' };
}

function authHeaderGet() {
  // return authorization header with jwt token
  const { token } = JSON.parse(localStorage.getItem('state')).userProfile;

  if (token) {
    return {
      Authorization: `Bearer ${token}`,
    };
  }
  return {};
}

// const testUrl =
//   process.env.NODE_ENV === 'development'
//     ? 'https://portal.tca.ingeniumedu.com'
//     : 'https://class.ingeniumedu.com';
const testUrl = 'https://portal.tca.ingeniumedu.com';

const transformRequest = (jsonData = {}) =>
  Object.entries(jsonData)
    .map((x) => `${encodeURIComponent(x[0])}=${encodeURIComponent(x[1])}`)
    .join('&');

export const post = (requestBody, endpoint) => {
  return axios
    .post(testUrl + endpoint, transformRequest(requestBody), authHeaderPost())
    .then((result) => result.data)
    .catch((err) => {
      history.push('/error');
      console.error(`The error is ${err}`);
    });
};

export const get = (requestBody = null, endpoint) => {
  // requestBody must be an object
  return axios
    .get(testUrl + endpoint, { params: requestBody, headers: authHeaderGet() })
    .then((result) => result.data)
    .catch((err) => {
      history.push('/error');
      console.error(`The error is ${err}`);
    });
};

// export const uploadImage = (file) => {
//   const fd = new FormData();
//   fd.append('upl', file);
//   console.log(file);
//   return axios
//     .post(`${testUrl}/upload`, fd, authHeaderPost())
//     .then((result) => result.data)
//     .catch((err) => {
//       history.push('/error');
//       console.error(`The error is ${err}`);
//     });
// };

export const uploadImage = (file) => {
  console.log(file);

  return new Promise((resolve, rej) => {
    get(null, '/getAwsCredentialsWithBucketConfiguration').then((res) => {
      const result = apiValidation(res);
      // AWS.config.update({
      //   accessKeyId: result.key,
      //   secretAccessKey: result.secret,
      //   region: result.region,
      // }); // for simplicity. In prod, use loadConfigFromFile, or env variables

      const bucket = new S3({
        params: {
          Bucket: result.bucket_name,
        },
        accessKeyId: result.key,
        secretAccessKey: result.secret,
        region: result.region,
      });
      const params = { Key: file.name, ContentType: file.type, Body: file };

      bucket
        .upload(params)
        .on('httpUploadProgress', (evt) => {
          console.log('Progress:', evt.loaded, '/', evt.total);
          // StateManager.dispatch(loadingActions.setAmountLoadedToStore(evt.loaded));
          // StateManager.dispatch(loadingActions.setTotalLoadedToStore(evt.total));
        })
        .send((err, data) => {
          console.log(err, data);
          const obj = {};
          obj.filename = data.Location;
          resolve(obj);
        });
    });
  });
};

export const uploadFiles = (files) => {
  const fd = new FormData();
  files.forEach(({ file, type }) => {
    fd.append('upl', file, `${file.name}|${type}`);
  });
  console.log(files);
  return axios
    .post(`${testUrl}/multipleUpload`, fd, authHeaderPost())
    .then((result) => result.data)
    .catch((err) => {
      console.error(`The error is ${err}`);
    });
};
