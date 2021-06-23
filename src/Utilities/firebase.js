import firebase from 'firebase/app';
import 'firebase/messaging';

const firebaseConfig = {
  apiKey: 'AIzaSyBHw4PABmM68oVfyqTc5BCgTbvuJapIxL4',
  authDomain: 'ingenium-backend-webportal.firebaseapp.com',
  projectId: 'ingenium-backend-webportal',
  storageBucket: 'ingenium-backend-webportal.appspot.com',
  messagingSenderId: '838837260191',
  appId: '1:838837260191:web:6c9e087ecbda21f1d5f7aa',
  measurementId: 'G-7G56SQSZME',
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// firebase.analytics();
const messaging = firebase.messaging();

export const getToken = (setTokenFound) => {
  return messaging
    .getToken({
      vapidKey:
        'BC0KWilVn8okoLQJMYNTCe-L6e7cafEyqE_I_Z9-cScvjS_pR2oM96sx4rBBNYgGhraajB6EU0ETj1BVAGNjTt8',
    })
    .then((currentToken) => {
      if (currentToken) {
        console.log('current token for client: ', currentToken);
        setTokenFound(true);
        // Track the token -> client mapping, by sending to backend server
        // show on the UI that permission is secured
      } else {
        console.log('No registration token available. Request permission to generate one.');
        setTokenFound(false);
        // shows on the UI that permission is required
      }
    })
    .catch((err) => {
      console.log('An error occurred while retrieving token. ', err);
      // catch error while creating client token
    });
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    messaging.onMessage((payload) => {
      resolve(payload);
    });
  });
