// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
  apiKey: "AIzaSyD8BOVBBzSuRE6XBG_9_oAOwG84oAp5Qnc",
  authDomain: "ksbdatatech-a01c9.firebaseapp.com",
  databaseURL: "https://ksbdatatech-a01c9-default-rtdb.firebaseio.com",
  projectId: "ksbdatatech-a01c9",
  storageBucket: "ksbdatatech-a01c9.appspot.com",
  messagingSenderId: "1060149520292",
  appId: "1:1060149520292:web:9d0858eb59527b00bec331",
  measurementId: "G-7MTQ1QSPE6"
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
if(firebase.messaging.isSupported()) {
  const messaging = firebase.messaging();
  messaging.onBackgroundMessage((payload) => {
    console.log(
      '[firebase-messaging-sw.js] Received background message ',
      payload
    );
    // Customize notification here
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
      body: payload.notification.body,
      icon: '/logo.png'
    };
  
    self.registration.showNotification(notificationTitle, notificationOptions);
  });
}
