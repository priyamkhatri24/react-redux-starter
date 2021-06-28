// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
  apiKey: 'AIzaSyBHw4PABmM68oVfyqTc5BCgTbvuJapIxL4',
  authDomain: 'ingenium-backend-webportal.firebaseapp.com',
  projectId: 'ingenium-backend-webportal',
  storageBucket: 'ingenium-backend-webportal.appspot.com',
  messagingSenderId: '838837260191',
  appId: '1:838837260191:web:6c9e087ecbda21f1d5f7aa',
  measurementId: 'G-7G56SQSZME',
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log('Received background message ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
