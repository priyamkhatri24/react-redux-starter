import axios from 'axios';
// import S3 from 'aws-sdk/clients/s3';
import { history } from '../Routing/History';
// import { apiValidation } from './utilities';
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

const testUrl =
  process.env.NODE_ENV === 'development'
    ? 'https://portal.ingeniumedu.com'
    : 'https://class.ingeniumedu.com';
// const testUrl = 'https://portal.ingeniumedu.com';

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
export const getNoPushToError = (requestBody = null, endpoint) => {
  // requestBody must be an object
  return axios
    .get(testUrl + endpoint, { params: requestBody, headers: authHeaderGet() })
    .then((result) => result.data)
    .catch((err) => {
      // history.push('/error');
      console.error(`The error is ${err}`);
    });
};

export const uploadImage = (file) => {
  const fd = new FormData();
  fd.append('upl', file);
  console.log(file);
  return axios
    .post(`${testUrl}/upload`, fd, authHeaderPost())
    .then((result) => result.data)
    .catch((err) => {
      history.push('/error');
      console.error(`The error is ${err}`);
    });
};

// export const uploadImage = (file) => {
//   console.log(file);

//   return new Promise((resolve, rej) => {
//     get(null, '/getAwsCredentialsWithBucketConfiguration').then((res) => {
//       const result = apiValidation(res);
//       // AWS.config.update({
//       //   accessKeyId: result.key,
//       //   secretAccessKey: result.secret,
//       //   region: result.region,
//       // }); // for simplicity. In prod, use loadConfigFromFile, or env variables

//       const bucket = new S3({
//         params: {
//           Bucket: result.bucket_name,
//         },
//         accessKeyId: result.key,
//         secretAccessKey: result.secret,
//         region: result.region,
//       });
//       const params = { Key: file.name, ContentType: file.type, Body: file };

//       bucket
//         .upload(params)
//         .on('httpUploadProgress', (evt) => {
//           console.log('Progress:', evt.loaded, '/', evt.total);
//           // StateManager.dispatch(loadingActions.setAmountLoadedToStore(evt.loaded));
//           // StateManager.dispatch(loadingActions.setTotalLoadedToStore(evt.total));
//         })
//         .send((err, data) => {
//           console.log(err, data);
//           const obj = {};
//           obj.filename = data.Location;
//           resolve(obj);
//         });
//     });
//   });
// };

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
/* eslint-disable */
export const json2xlsDownload = (JSONData, ReportTitle, ShowLabel) => {
  //  If JSONData is not an object then JSON.parse will parse the JSON string in an Object
  const arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;

  let CSV = ',' + '\r\n\n';

  //  This condition will generate the Label/Header
  if (ShowLabel) {
    let row = '';

    //  This loop will extract the label from 1st index of on array
    for (let index in arrData[0]) {
      //  Now convert each value to string and comma-seprated
      row += index + ',';
    }

    row = row.slice(0, -1);

    //  append Label row with line break
    CSV += row + '\r\n';
  }

  //  1st loop is to extract each row
  for (let i = 0; i < arrData.length; i++) {
    let row = '';

    //  2nd loop will extract each column and convert it in string comma-seprated
    for (let index in arrData[i]) {
      row += '"' + arrData[i][index] + '",';
    }

    row.slice(0, row.length - 1);

    //  add a line break after each row
    CSV += row + '\r\n';
  }

  if (CSV == '') {
    alert('Invalid data');
    return;
  }

  //  Generate a file name
  let fileName = 'Report_';
  //  this will remove the blank-spaces from the title and replace it with an underscore
  fileName += ReportTitle.replace(/ /g, '_');

  //  Initialize file format you want csv or xls
  let uri = 'data:text/csv;charset=utf-8,' + escape(CSV);

  // Now the little tricky part.
  // you can use either>> window.open(uri);
  // but this will not work in some browsers
  // or you will not get the correct file extension

  //  this trick will generate a temp <a /> tag
  const link = document.createElement('a');
  link.href = uri;

  //  set the visibility hidden so it will not effect on your web-layout
  link.style = 'visibility:hidden';
  link.download = fileName + '.csv';

  //  this part will append the anchor tag and remove it after automatic click
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const server =
  process.env.NODE_ENV === 'development'
    ? 'https://portal.ingeniumedu.com'
    : 'https://class.ingeniumedu.com';
