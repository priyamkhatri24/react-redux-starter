import axios from 'axios';

const config = {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
};

const testUrl = 'http://13.126.247.152:3000';
// const prod_url = '';

const transformRequest = (jsonData = {}) =>
  Object.entries(jsonData)
    .map((x) => `${encodeURIComponent(x[0])}=${encodeURIComponent(x[1])}`)
    .join('&');

export const post = (requestBody, endpoint) => {
  return axios
    .post(testUrl + endpoint, transformRequest(requestBody), config)
    .then((result) => result.data)
    .catch((err) => {
      console.error(`The error is ${err}`);
    });
};

export const get = (requestBody = null, endpoint) => {
  // requestBody must be an object
  return axios
    .get(testUrl + endpoint, { params: requestBody })
    .then((result) => result.data)
    .catch((err) => {
      console.error(`The error is ${err}`);
    });
};
