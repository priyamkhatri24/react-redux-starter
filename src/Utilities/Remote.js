import axios from 'axios';

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
      console.error(`The error is ${err}`);
    });
};

export const get = (requestBody = null, endpoint) => {
  // requestBody must be an object
  return axios
    .get(testUrl + endpoint, { params: requestBody, headers: authHeaderGet() })
    .then((result) => result.data)
    .catch((err) => {
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
      console.error(`The error is ${err}`);
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
