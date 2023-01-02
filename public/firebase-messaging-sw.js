// // Scripts for firebase and firebase messaging
// importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js');
// importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js');

// import { initializeApp } from 'firebase/app';
// import { getMessaging } from 'firebase/messaging';

// // Initialize the Firebase app in the service worker by passing the generated config
// const firebaseConfig = {
//   apiKey: 'AIzaSyCfzlbpDIEy6BbiaBd0vpauoCSIeyEokhk',
//   authDomain: 'web-notifications-c1bbf.firebaseapp.com',
//   projectId: 'web-notifications-c1bbf',
//   storageBucket: 'web-notifications-c1bbf.appspot.com',
//   messagingSenderId: '1021666200890',
//   appId: '1:1021666200890:web:8584cd0ac0df2dae7c9403',
//   measurementId: 'G-KTE0ZLMW52',
// };

// const firebaseApp = initializeApp(firebaseConfig);

// // Retrieve firebase messaging
// const messaging = getMessaging(firebaseApp);

// messaging.onMessage((payload) => {
//   console.log('message recieved', payload);

//   const notificationTitle = 'TEST';
//   const notificationOptions = {
//     body: 'noti aagyaa',
//   };
//   self.registration.showNotification(notificationTitle, notificationOptions);
// });

// messaging.onBackgroundMessage(function (payload) {
//   console.log('Received background messagee ', payload);

//   const notificationTitle = 'TEST';
//   const notificationOptions = {
//     body: 'noti aagyaa',
//   };
//   self.registration.showNotification(notificationTitle, notificationOptions);
// });

// self.addEventListener('notificationclick', function (event) {
//   const url = event.notification.data['gcm.notification.url'];
//   event.notification.close(); // Android needs explicit close.
//   event.waitUntil(
//     clients.matchAll({ type: 'window' }).then((windowClients) => {
//       // Check if there is already a window/tab open with the target URL
//       for (let i = 0; i < windowClients.length; i++) {
//         const client = windowClients[i];
//         // If so, just focus it.
//         if (client.url === url && 'focus' in client) {
//           return client.focus();
//         }
//       }
//       // If not, then open the target URL in a new window/tab.
//       if (clients.openWindow) {
//         console.log(clients);
//         return clients.openWindow(url);
//       }
//     }),
//   );
// });
