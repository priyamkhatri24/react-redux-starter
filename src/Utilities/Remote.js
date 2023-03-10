import axios from 'axios';
import { history } from '../Routing/History';

function authHeaderPost() {
  // return authorization header with jwt token
  const { token } = JSON.parse(localStorage.getItem('state')).userProfile; // authtoken lelo jahan bhi hai

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
// const testUrl = 'https://class.ingeniumedu.com';

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

export const server =
  process.env.NODE_ENV === 'development'
    ? 'https://portal.ingeniumedu.com'
    : 'https://class.ingeniumedu.com';
