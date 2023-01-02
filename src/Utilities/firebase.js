import firebase from 'firebase/app';
import 'firebase/messaging';

const firebaseConfig = {
  apiKey: 'AIzaSyCfzlbpDIEy6BbiaBd0vpauoCSIeyEokhk',
  authDomain: 'web-notifications-c1bbf.firebaseapp.com',
  projectId: 'web-notifications-c1bbf',
  storageBucket: 'web-notifications-c1bbf.appspot.com',
  messagingSenderId: '1021666200890',
  appId: '1:1021666200890:web:8584cd0ac0df2dae7c9403',
  measurementId: 'G-KTE0ZLMW52',
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
            'BFmQxaxpDdQnyNJfY0huEOtOUNSX-jP2oIvjWI3w5eirn9ASuY56Zs2USZVmDZOG0BKAiOfKp-vJXTHUYyPxz1c',
        })
        .then((currentToken) => {
          if (currentToken) {
            console.log('current token for client: ', currentToken);
            setTokenFound(true);

            // messaging
            //   .getMessaging()
            //   .subscribeToTopic([currentToken], 'mohitpatel')
            //   .then((response) => {
            //     // See the MessagingTopicManagementResponse reference documentation
            //     // for the contents of response.
            //     console.log('Successfully subscribed to topic:', response);
            //   })
            //   .catch((error) => {
            //     console.log('Error subscribing to topic:', error);
            //   });

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

export const sibscribeToTopic = () => {};

export const onMessageListener = () => {
  messaging.onMessage((payload) => {
    console.log('noti', payload);
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
      body: payload.notification.body,
      //  icon: payload.notification.icon,
    };

    // self.registration.showNotification(notificationTitle, notificationOptions);

    if (!('Notification' in window)) {
      console.log('This browser does not support system notifications.');
    } else if (Notification.permission === 'granted') {
      // If it's okay let's create a notification
      console.log('aagya');

      const notification = new Notification(notificationTitle, notificationOptions);
      notification.onclick = function (event) {
        // event.preventDefault();
        window.open(payload.notification.click_action, '_blank');
        notification.close();
      };
    }
  });
};
