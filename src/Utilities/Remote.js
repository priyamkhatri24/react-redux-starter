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

// const config = {
//   headers: {
//     'Content-Type': 'application/x-www-form-urlencoded',
//   },
// };

const testUrl = 'http://13.126.247.152:3000';
// const prod_url = '';

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
