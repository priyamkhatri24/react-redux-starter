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
// firebase.initializeApp(firebaseConfig);
// firebase.analytics();
let messaging = null;
if (firebase.messaging.isSupported()) {
  firebase.initializeApp(firebaseConfig);
  messaging = firebase.messaging();
} else {
  console.log('no-support :(');
}

export const getToken = (setTokenFound) => {
  return messaging
    ? messaging
        .getToken({
          vapidKey:
            'BC0KWilVn8okoLQJMYNTCe-L6e7cafEyqE_I_Z9-cScvjS_pR2oM96sx4rBBNYgGhraajB6EU0ETj1BVAGNjTt8',
        })
        .then((currentToken) => {
          if (currentToken) {
            console.log('current token for client: ', currentToken);
            setTokenFound(true);
            return currentToken;
            // Track the token -> client mapping, by sending to backend server
            // show on the UI that permission is secured
          }
          console.log('No registration token available. Request permission to generate one.');
          setTokenFound(false);
          return '';
          // shows on the UI that permission is required
        })
        .catch((err) => {
          console.log('An error occurred while retrieving token. ', err);
          // catch error while creating client token
        })
    : null;
};

export const onMessageListener = () => {
  messaging.onMessage(function sid(payload) {
    console.log(payload);
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
      body: payload.notification.body,
      //  icon: payload.notification.icon,
    };

    if (!('Notification' in window)) {
      console.log('This browser does not support system notifications.');
    } else if (Notification.permission === 'granted') {
      // If it's okay let's create a notification
      const notification = new Notification(notificationTitle, notificationOptions);
      notification.onclick = function sd(event) {
        event.preventDefault();
        window.open(payload.notification.click_action, '_blank');
        notification.close();
      };
    }
  });
};
